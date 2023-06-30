<script lang="ts">
  import "$appcss";
  import { searchStore } from "$libs/stores";
  import SearchInput from "$components/search-input/search-input.svelte";
  import { navStore } from "$libs/stores";
  import { t } from "$libs/translations";

  import TopBarMenu from "./top-bar-menu.svelte";
  import { isDev, topbarDoubleClick } from "$libs/native-electron";
  import { onMount } from "svelte";

  let { nextPath, prevPath } = navStore;

  let dev = false;
  onMount(async () => {
    dev = await isDev();
  });
</script>

<header
  class="border-gray relative z-20 flex h-12 w-full items-center justify-between border border-x-0 border-t-0 pr-2"
  style="-webkit-app-region: drag"
  on:dblclick={topbarDoubleClick}
>
  <ul class="text-gray flex h-10 items-center gap-1 pl-20 align-middle leading-10">
    <a href="/?tab=discover" data-testid="home-button">
      <div class="home-btn w-12 text-center text-2xl">
        <i class="icon-tea-logo-iconasset-1" />
      </div>
    </a>
    <p class="text-gray px-2">{dev ? "dev" : "beta"}</p>
    <button
      on:click={navStore.back}
      class:active={$prevPath}
      class="hover:bg-gray h-[28px] rounded-sm px-2 pt-1 text-xs opacity-50 transition-all hover:text-black"
      title="go back"><i class="icon-arrow-left" /></button
    >
    <button
      on:click={navStore.next}
      class:active={$nextPath}
      class="hover:bg-gray h-[28px] rounded-sm px-2 pt-1 text-xs opacity-50 transition-all hover:text-black"
      title="go forward"><i class="icon-arrow-right" /></button
    >
  </ul>
  <div class="relative w-1/3 px-2">
    <SearchInput
      data-testid="topbar-search-input"
      class="border-gray h-9 w-full rounded-sm border"
      size="small"
      placeholder={$t("store-search-placeholder")}
      onFocus={() => {
        searchStore.searching.set(true);
      }}
      readonly={true}
    />

    <kbd
      class="bg-gray pointer-events-none absolute right-3 top-0 mt-1 flex items-center rounded-sm px-2 text-white opacity-50"
      style="letter-spacing: 0.5pt"
    >
      <span class="text-lg">⌘</span>
      <span class="text-xs" style="font-size: smaller">K</span>
    </kbd>
  </div>
  <TopBarMenu />
</header>

<style>
  header {
    background: rgba(26, 26, 26, 0.9);
    backdrop-filter: blur(2px);
    box-sizing: border-box;
  }
  .home-btn {
    height: 46px;
    width: 46px;
    line-height: 46px;
    padding-left: 3px;
    background-size: cover;
    background-position: center center;
    background-image: url("/images/gradient-bg.png");
    color: #222222;
  }

  .home-btn:hover {
    color: white;
  }

  .home-btn:active {
    color: #222222;
    border: 2px solid #222222;
  }

  p {
    font-size: 10px;
  }
  ul button {
    pointer-events: none;
  }

  ul button.active {
    color: white;
    pointer-events: all;
    opacity: 1;
  }
</style>
