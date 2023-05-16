<script lang="ts">
  import "$appcss";
  import "@tea/ui/icons/icons.css";
  import { t } from "$libs/translations";
  import Button from "@tea/ui/button/button.svelte";
  import ButtonIcon from "@tea/ui/button-icon/button-icon.svelte";
  import ToolTip from "@tea/ui/tool-tip/tool-tip.svelte";
  import ProgressCircle from "@tea/ui/progress-circle/progress-circle.svelte";

  import type { GUIPackage } from "$libs/types";
  import { packagesStore } from "$libs/stores";
  import { openPackageEntrypointInTerminal, shellOpenExternal } from "@native";
  import { findAvailableVersions, findRecentInstalledVersion } from "$libs/packages/pkg-utils";
  import { trimGithubSlug } from "$libs/github";
  import PackageImage from "../package-card/bg-image.svelte";
  import PackageVersionSelector from "$components/package-install-button/package-version-selector.svelte";
  import { fixPackageName } from "$libs/packages/pkg-utils";
  import { semverCompare } from "$libs/packages/pkg-utils";

  export let pkg: GUIPackage;
  let installing = false;
  let uninstalling = false;

  const install = async (version: string) => {
    if (installing) {
      return;
    }
    try {
      installing = true;
      await packagesStore.installPkg(pkg, version);
    } finally {
      installing = false;
    }
  };

  const uninstall = async () => {
    if (uninstalling) {
      return;
    }

    try {
      uninstalling = true;
      await packagesStore.uninstallPkg(pkg);
    } finally {
      uninstalling = false;
    }
  };

  const prune = async () => {
    if (uninstalling) {
      return;
    }

    try {
      uninstalling = true;
      const versions = (pkg?.installed_versions || []).sort((a, b) => semverCompare(b, a));
      for (const [i, v] of versions.entries()) {
        if (i) {
          // skip the latest version = 0
          try {
            await packagesStore.deletePkg(pkg, v);
          } catch (e) {
            console.error(e);
          }
        }
      }
    } finally {
      uninstalling = false;
    }
  };

  let copied = false;
  const copyPackagePantryLink = async () => {
    const pantryLink = `https://tea.xyz/+${pkg.full_name}`.toLowerCase();
    await navigator.clipboard.writeText(pantryLink);
    copied = true;
  };
</script>

<section class="mt-4 bg-black">
  <header class="flex">
    <figure class="grow-1 relative w-1/3">
      <PackageImage class="min-h-[300px] w-full overflow-hidden" {pkg} layout="none" />
      {#if pkg.install_progress_percentage && pkg.install_progress_percentage < 100}
        <div class="absolute left-0 top-0 z-40 h-full w-full bg-black bg-opacity-50">
          <div class="absolute left-0 right-0 top-1/2 m-auto -mt-12 h-24 w-24">
            <ProgressCircle value={pkg.install_progress_percentage} />
          </div>
        </div>
      {/if}
    </figure>
    <article class="w-2/3 p-4 pt-8">
      <div class="align-center flex items-center gap-2">
        <h3 data-testid="package-banner-header" class="text-3xl text-primary">
          {fixPackageName(pkg.name)}
        </h3>
        <ButtonIcon
          icon="pencil"
          helpText="edit package"
          on:click={() =>
            shellOpenExternal(
              `https://github.com/teaxyz/pantry/blob/main/projects/${pkg.full_name}/package.yml`
            )}
        />
        <ButtonIcon icon="share-1" helpText="share package" on:click={copyPackagePantryLink} />
        {#if copied}
          <p class="text-teal">copied!</p>
        {/if}
      </div>
      {#if pkg.maintainer}
        <span>{pkg.maintainer}</span>
      {/if}
      <p class="mt-4 text-sm">{pkg.desc}</p>
      <menu class="mt-4 flex h-10 gap-4 text-xs">
        <div class="w-fit min-w-[160px]">
          <PackageVersionSelector
            buttonSize="large"
            {pkg}
            availableVersions={findAvailableVersions(pkg)}
            onClick={install}
          />
        </div>
        {#if (pkg?.installed_versions?.length || 0) > 0}
          <div class="min-w-[120px]">
            <ToolTip>
              <Button
                slot="target"
                data-testid="uninstall-button"
                class="h-10"
                type="plain"
                color="blue"
                onClick={uninstall}
                loading={uninstalling}
              >
                <div class="version-item flex w-full items-center justify-center gap-x-1 text-xs">
                  <div class="icon-trash" />
                  <div>{$t("package.cta-UNINSTALL")}</div>
                </div>
              </Button>
              <div slot="tooltip-content" class="flex flex-col items-center">
                <div>Removes all the versions of the package</div>
              </div>
            </ToolTip>
          </div>
        {/if}
        {#if (pkg?.installed_versions?.length || 0) > 1}
          <div class="min-w-[120px]">
            <ToolTip>
              <Button
                slot="target"
                class="h-10"
                type="plain"
                color="blue"
                onClick={prune}
                loading={uninstalling}
              >
                <div class="version-item flex w-full items-center justify-center gap-x-1 text-xs">
                  <div class="icon-scissors" />
                  <div>{$t("package.cta-PRUNE")}</div>
                </div>
              </Button>
              <div slot="tooltip-content" class="flex flex-col items-center">
                <div>Removes {(pkg.installed_versions?.length || 0) - 1} old versions</div>
                <div>Keeps latest (v{findRecentInstalledVersion(pkg)})</div>
              </div>
            </ToolTip>
          </div>
        {/if}
        {#if pkg.github}
          <button
            class="group flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-sm border border-gray hover:bg-[#e1e1e1]"
            on:click={() => {
              if (pkg.github) {
                const slug = trimGithubSlug(pkg.github);
                shellOpenExternal(`https://github.com/${slug}`);
              }
            }}
          >
            <div class="icon-github flex text-xl text-gray group-hover:text-black" />
          </button>
        {/if}
        {#if pkg.installed_versions?.length}
          <div class="min-w-[160px]">
            <Button
              class="h-10"
              type="plain"
              color="black"
              onClick={() => {
                openPackageEntrypointInTerminal(pkg.full_name);
              }}
            >
              {#if pkg.full_name == "github.com/AUTOMATIC1111/stable-diffusion-webui"}
                OPEN
              {:else}
                OPEN IN TERMINAL
              {/if}
            </Button>
          </div>
        {/if}
      </menu>
    </article>
  </header>
</section>
