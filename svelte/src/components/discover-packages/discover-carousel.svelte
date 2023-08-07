<script lang="ts">
  import "$appcss";
  import { t } from "$libs/translations";
  import Preloader from "$components/preloader/preloader.svelte";
  import Package from "$components/packages/package.svelte";
  import { packagesStore } from "$libs/stores";
  import Carousel from "./carousel.svelte";

  const { packageList: allPackages } = packagesStore;

  export let scrollY = 0;

  const onScroll = (e: Event) => {
    const target = e.target as HTMLInputElement;
    scrollY = target.scrollTop || 0;
  };

  $: spotlight = $allPackages.find((p) => p.categories.includes("spotlight"));

  $: packages = $allPackages
    .filter((p) => p.categories.includes("ai"))
    .sort((a, b) => {
      return a.manual_sorting - b.manual_sorting;
    });
</script>

<div class="relative h-full w-full">
  <ul class="align-center flex flex-col items-stretch px-6" on:scroll={onScroll}>
    {#if packages.length > 0}
      {#if spotlight}
        <div class="z-1 p-1">
          <Package pkg={spotlight} layout="left" tight={true} />
        </div>
      {/if}
      <article class="mt-5 px-1 pb-4">
        <h1 class="font-mona text-2xl">{$t("discover.featured_title")}</h1>
        <p class="text-gray mb-4 text-[14px]">{$t("discover.featured_description")}</p>
        <hr />
      </article>
      <Carousel pkgs={packages} />
    {:else}
      {#each Array(9) as _}
        <section class="card p-1 h-{238}">
          <div class="border-gray h-full w-full border">
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
    /* padding-right: 4px; */
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

  hr {
    border-top: 1px solid #5c5c5c;
  }
</style>
