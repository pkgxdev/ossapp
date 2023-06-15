<script lang="ts">
  import "$appcss";
  // import { t } from '$libs/translations';
  import { SideMenuOptions } from "$libs/types";
  import Preloader from "@tea/ui/Preloader/Preloader.svelte";
  import Package from "$components/packages/package.svelte";
  import { packagesStore } from "$libs/stores";

  const { packageList: allPackages } = packagesStore;
  export let packageFilter: SideMenuOptions = SideMenuOptions.discover;

  export let scrollY = 0;

  const onScroll = (e: Event) => {
    const target = e.target as HTMLInputElement;
    scrollY = target.scrollTop || 0;
  };

  $: packages = $allPackages
    .filter((p) => p.categories.includes(SideMenuOptions.discover))
    .sort((a, b) => {
      return a.manual_sorting - b.manual_sorting;
    });
</script>

<div class="relative h-full w-full">
  <ul class="flex flex-col items-stretch" on:scroll={onScroll}>
    {#if packages.length > 0}
      {#each packages as pkg, idx}
        <div class="z-1 p-1">
          <Package tab={packageFilter} {pkg} layout={idx % 2 === 0 ? "left" : "right"} />
        </div>
      {/each}
    {:else}
      {#each Array(9) as _}
        <section class="card p-1 h-{238}">
          <div class="h-full w-full border border-gray">
            <Preloader />
          </div>
        </section>
      {/each}
    {/if}
  </ul>
</div>

<style>
  ul {
    margin-top: 0px;
    padding-top: 80px;
    padding-bottom: 8px;
    height: calc(100vh - 49px);
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 4px;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #272626;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #949494;
    border-radius: 4px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: white;
  }
</style>
