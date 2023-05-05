<script lang="ts">
  import "$appcss";
  import { goto } from "$app/navigation";
  import { initSentry } from "$libs/sentry";
  import { navigating } from "$app/stores";
  import { afterNavigate } from "$app/navigation";
  import TopBar from "$components/top-bar/top-bar.svelte";
  import { navStore, packagesStore, searchStore } from "$libs/stores";
  import { listenToChannel } from "@native";
  import Mousetrap from "mousetrap";

  import SearchPopupResults from "$components/search-popup-results/search-popup-results.svelte";
  import { getProtocolPath } from "@native";

  import { onDestroy, onMount } from "svelte";

  let view: HTMLElement;

  const { setNewPath } = navStore;
  const { searching } = searchStore;

  $: if ($navigating) view.scrollTop = 0;

  afterNavigate(({ from, to }) => {
    if (to && to?.route.id && from && from?.url) {
      const nextPath = to.url.href.replace(to.url.origin, "");
      const fromPath = from?.url.href.replace(from.url.origin, "");
      setNewPath(nextPath, fromPath || "/");
    }
  });

  const syncPath = async () => {
    // used by the tea:// protocol to suggest a path to open
    const path = await getProtocolPath();
    if (path) goto(path);
  };

  onMount(async () => {
    // used by the tea:// protocol to suggest a path to open
    syncPath();
    listenToChannel("sync-path", syncPath);
    Mousetrap.bind(["command+k", "ctrl+k"], function () {
      searchStore.searching.set(!$searching);
      // return false to prevent default browser behavior
      // and stop event from bubbling
      return false;
    });
    Mousetrap.bind(["esc"], function () {
      searchStore.searching.set(false);
      return false;
    });
    packagesStore.init();
    initSentry();
  });

  onDestroy(() => {
    packagesStore.destroy();
  });
</script>

<div id="main-layout" class="rounded-xl border border-gray font-inter transition-all">
  <TopBar />
  <div class="scroll-manager relative z-10">
    <section class="relative" bind:this={view}>
      <div class="content">
        <slot />
      </div>
      <SearchPopupResults />
    </section>
  </div>
</div>

<style>
  #main-layout {
    height: 100vh;
    overflow: hidden;
  }

  .scroll-manager {
    height: 100%;
    overflow: hidden;
    padding-right: 8px;
  }
  section {
    height: calc(100vh - 50px); /* win.height - header*/
    overflow-y: auto;
    box-sizing: border-box;
  }

  slot {
    z-index: 1;
  }

  div {
    position: relative;
  }

  .content {
    height: auto;
    overflow-y: hidden;
    padding-left: 4px;
    padding-right: 4px;
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
</style>
