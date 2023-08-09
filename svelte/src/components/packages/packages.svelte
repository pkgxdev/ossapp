<script lang="ts">
  import "$appcss";
  import { watchResize } from "svelte-watch-resize";
  import InfiniteScroll from "svelte-infinite-scroll";
  // import { t } from '$libs/translations';
  import type { GUIPackage } from "$libs/types";
  import moment from "moment";
  import { PackageStates, SideMenuOptions } from "$libs/types";
  import Preloader from "$components/preloader/preloader.svelte";
  import Package from "./package.svelte";
  import NoInstalls from "./no-installs.svelte";
  import NoUpdates from "./no-updates.svelte";
  import { packagesStore, scrollStore } from "$libs/stores";
  import { afterUpdate, beforeUpdate } from "svelte";
  import { packageWasUpdated } from "$libs/packages/pkg-utils";

  const { packageList: allPackages } = packagesStore;
  export let packageFilter: SideMenuOptions = SideMenuOptions.all;

  export let scrollY = 0;
  export let packageCount = 0;

  let loadMore = 9;
  let limit = loadMore + 9;

  const updateLimit = (value: number) => {
    limit += value;
    scrollStore.setLimit(packageFilter, limit);
  };

  // TODO: figure out a better type strategy here so that this breaks if SideMenuOptions is updated
  const pkgFilters: { [key: string]: (pkg: GUIPackage) => boolean } = {
    [SideMenuOptions.all]: (_pkg: GUIPackage) => true,
    [SideMenuOptions.installed]: (pkg: GUIPackage) => {
      return [
        PackageStates.INSTALLED,
        PackageStates.INSTALLING,
        PackageStates.NEEDS_UPDATE,
        PackageStates.UPDATING
      ].includes(pkg.state);
    },
    [SideMenuOptions.installed_updates_available]: (pkg: GUIPackage) => {
      return (
        [PackageStates.UPDATING, PackageStates.NEEDS_UPDATE].includes(pkg.state) ||
        packageWasUpdated(pkg)
      );
    },
    [SideMenuOptions.recently_updated]: (pkg: GUIPackage) => {
      return moment(pkg.updated_at).isAfter(moment().subtract(30, "days"));
    },
    [SideMenuOptions.new_packages]: (pkg: GUIPackage) => {
      return moment(pkg.created_at).isAfter(moment().subtract(30, "days"));
    },
    [SideMenuOptions.made_by_tea]: (pkg: GUIPackage) => pkg.full_name.includes("tea.xyz"),
    [SideMenuOptions.local]: (pkg: GUIPackage) => !!pkg.is_local
  };

  const onScroll = (e: Event) => {
    const target = e.target as HTMLInputElement;
    scrollY = target.scrollTop || 0;
    scrollStore.setScrollPosition(packageFilter, scrollY);
  };

  $: packages = $allPackages.filter(pkgFilters[packageFilter] || pkgFilters.all);
  $: {
    packageCount = packages.length;
  }

  const onResize = (node: HTMLElement) => {
    const assumedCardHeight = 250;
    const cardRows = Math.floor(packages.length / 3);
    const minCardRows = Math.floor(node.scrollHeight / assumedCardHeight);
    if (cardRows < minCardRows) {
      const addLimit = 3 * (minCardRows - cardRows);
      updateLimit(addLimit);
    }
  };

  let scrollElement: any = null;
  let prevFilter: SideMenuOptions | null;

  // Restore the limit before the update...
  beforeUpdate(() => {
    if (prevFilter !== packageFilter) {
      limit = scrollStore.getLimit(packageFilter);
    }
  });

  // ...and scroll position after the update
  afterUpdate(() => {
    if (prevFilter !== packageFilter && scrollElement) {
      prevFilter = packageFilter;
      const scrollPosition = scrollStore.getScrollPosition(packageFilter);
      scrollElement.scrollTop = scrollPosition;
    }
  });
</script>

<div class="relative h-full w-full">
  <ul
    bind:this={scrollElement}
    class="flex flex-wrap content-start bg-black px-6"
    use:watchResize={onResize}
    on:scroll={onScroll}
  >
    {#if packages.length > 0}
      {#each packages as pkg, index}
        {#if index < limit}
          <div class="card z-1 p-1" class:animate-pulse={pkg.state === PackageStates.INSTALLING}>
            <Package tab={packageFilter} {pkg} layout="bottom" />
          </div>
        {/if}
      {/each}
    {:else if packageFilter === SideMenuOptions.installed}
      <NoInstalls />
    {:else if packageFilter === SideMenuOptions.installed_updates_available}
      <NoUpdates />
    {:else}
      {#each Array(9) as _}
        <section class="card p-1 h-{238}">
          <div class="border-gray h-full w-full border">
            <Preloader />
          </div>
        </section>
      {/each}
    {/if}
    <InfiniteScroll threshold={100} on:loadMore={() => updateLimit(loadMore)} />
  </ul>
</div>

<style>
  ul {
    margin-top: 0px;
    padding-top: 80px;
    height: calc(100vh - 49px);
    overflow-y: scroll;
    overflow-x: hidden;
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

  .card {
    width: 100%;
  }

  @media screen and (min-width: 650px) {
    .card {
      width: 50%;
    }
  }

  @media screen and (min-width: 1000px) {
    .card {
      width: 33.333333%;
    }
  }
</style>
