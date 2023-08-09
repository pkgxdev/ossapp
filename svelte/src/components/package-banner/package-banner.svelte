<script lang="ts">
  import "$appcss";
  import "../../icons/icons.css";
  import { t } from "$libs/translations";
  import Button from "$components/button/button.svelte";
  import ButtonIcon from "$components/button-icon/button-icon.svelte";
  import ToolTip from "$components/tool-tip/tool-tip.svelte";
  import ProgressCircle from "$components/progress-circle/progress-circle.svelte";

  import type { GUIPackage } from "$libs/types";
  import { packagesStore } from "$libs/stores";
  import { shellOpenExternal } from "@native";
  import { findAvailableVersions, findRecentInstalledVersion } from "$libs/packages/pkg-utils";
  import PlainPackageImage from "../package-card/plain-bg-image.svelte";
  import PackageVersionSelector from "$components/package-install-button/package-version-selector.svelte";
  import { getPackageName } from "$libs/packages/pkg-utils";
  import { semverCompare } from "$libs/packages/pkg-utils";
  import InstallResultOverlay from "$components/install-result-overlay/install-result-overlay.svelte";
  import OpenPackageButton from "$components/buttons/open-package-button.svelte";
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
    <figure class="relative max-w-[240px]">
      <PlainPackageImage
        class="min-h-[240px] w-full overflow-hidden rounded-lg"
        project={pkg.full_name}
        url={pkg.image_512_url}
        cachedImageUrl={pkg.cached_image_url}
        hasImage={!!pkg.image_added_at}
      />
      {#if pkg.install_progress_percentage && pkg.install_progress_percentage < 100}
        <div class="absolute left-0 top-0 z-40 h-full w-full bg-black bg-opacity-50">
          <div class="absolute left-0 right-0 top-1/2 m-auto -mt-12 h-24 w-24">
            <ProgressCircle value={pkg.install_progress_percentage} />
          </div>
        </div>
      {/if}
      <InstallResultOverlay {pkg} />
    </figure>

    <article class="grow-1 flex flex-col justify-center px-4">
      <nav class="flex gap-2 pb-4">
        <ButtonIcon
          icon="pencil"
          helpText="edit package"
          on:click={() =>
            shellOpenExternal(
              `https://github.com/teaxyz/pantry/blob/main/projects/${pkg.full_name}/package.yml`
            )}
        />
        <ButtonIcon
          icon="github"
          helpText="open github repo"
          on:click={() => {
            if (pkg.github_url) {
              shellOpenExternal(pkg.github_url);
            }
          }}
        />
        <ButtonIcon icon="share-1" helpText="share package" on:click={copyPackagePantryLink} />
        {#if copied}
          <p class="text-teal">copied!</p>
        {/if}
      </nav>
      <h3 data-testid="package-banner-header" class="text-primary text-3xl">
        {getPackageName(pkg)}
      </h3>
      {#if pkg.maintainer}
        <span>{pkg.maintainer}</span>
      {/if}
    </article>
  </header>

  <p class="mt-4 text-sm">{pkg.description}</p>

  <article class="">
    <div>
      {#if pkg.installed_versions?.length}
        <div class="mt-4 w-[200px]">
          <OpenPackageButton on:openterminal {pkg} buttonSize="large" />
        </div>
      {/if}
    </div>
    <menu class="mb-4 mt-4 flex h-fit flex-wrap gap-4 text-xs">
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
    </menu>
  </article>
</section>
