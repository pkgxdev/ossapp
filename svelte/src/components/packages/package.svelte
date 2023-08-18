<script lang="ts">
  import "$appcss";

  import { PackageStates, type GUIPackage } from "$libs/types";
  import { packagesStore } from "$libs/stores";
  import PackageCard from "$components/package-card/package-card.svelte";
  import LocalPackageCard from "$components/package-card/local-package-card.svelte";

  export let tab = "discover";
  export let pkg: GUIPackage;
  export let layout: "bottom" | "left" | "right" = "bottom";

  export let tight = false;
  export let prioritizeUpdateCta = false;
</script>

{#if pkg.is_local}
  <LocalPackageCard {pkg} />
{:else}
  <PackageCard
    {pkg}
    {layout}
    {tight}
    {prioritizeUpdateCta}
    link="/packages/{pkg.slug}?tab={tab}"
    progessLoading={pkg.install_progress_percentage}
    onClickCTA={async () => {
      if (
        [PackageStates.INSTALLED, PackageStates.INSTALLING, PackageStates.UPDATING].includes(
          pkg.state
        )
      ) {
        return;
      }
      packagesStore.installPkg(pkg);
    }}
  />
{/if}
