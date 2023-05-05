<script lang="ts">
  import "$appcss";

  import { PackageStates, type GUIPackage } from "$libs/types";
  import { packagesStore } from "$libs/stores";
  import PackageCard from "$components/package-card/package-card.svelte";

  export let tab = "all";
  export let pkg: GUIPackage;
  export let layout: "bottom" | "left" | "right" = "bottom";
</script>

<PackageCard
  {pkg}
  {layout}
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
