<script lang="ts">
  import "$appcss";
  import type { GUIPackage } from "$libs/types";
  import type { Package } from "@tea/ui/types";
  import { PackageStates } from "$libs/types";
  import Preloader from "@tea/ui/Preloader/Preloader.svelte";
  import PackageCard from "$components/packages/package.svelte";
  import { onMount } from "svelte";
  import { packagesStore } from "$libs/stores";

  export let pkg: Package;

  let packages: GUIPackage[] = [];

  onMount(async () => {
    if (!packages.length) {
      const matches = await packagesStore.search(pkg.desc, 4);
      packages = matches.filter((mp) => mp.full_name !== pkg.full_name).slice(0, 3);
    }
  });
</script>

<header class="flex items-center justify-between border border-gray bg-black p-4 text-primary">
  <span>MORE LIKE THIS</span>
</header>
<ul class="grid grid-cols-3 bg-black">
  {#if packages.length > 0}
    {#each packages as pkg}
      <div class={pkg.state === PackageStates.INSTALLING ? "animate-pulse" : ""}>
        <PackageCard {pkg} />
      </div>
    {/each}
  {:else}
    {#each Array(9) as _}
      <section class="h-50 border border-gray p-4">
        <Preloader />
      </section>
    {/each}
  {/if}
</ul>
