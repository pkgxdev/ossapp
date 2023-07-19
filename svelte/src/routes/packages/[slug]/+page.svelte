<script lang="ts">
  import "$appcss";
  import { t } from "$libs/translations";
  import { page } from "$app/stores";
  import Preloader from "$components/preloader/preloader.svelte";
  import Terminal from "$components/terminal/terminal.svelte";
  import WebUI from "$components/web-ui/web-ui.svelte";

  /** @type {import('./$types').PageData} */
  export let data: { slug: string; content: string; title: string };

  import { packagesStore, ptys } from "$libs/stores";
  import { onMount } from "svelte";
  import NotificationBar from "$components/notification-bar/notification-bar.svelte";
  import { trackViewPackagePage } from "$libs/analytics";
  import type { TeaSubprocess } from "$libs/stores/ptys";
  import PackagePage from "$components/package-page/package-page.svelte";
  import type { GUIPackage } from "$libs/types";
  import Tab from "$components/tabs/tab.svelte";

  const { packageList } = packagesStore;

  $: pkg = $packageList.find((p: GUIPackage) => p.slug === data?.slug);

  $: pty = undefined as TeaSubprocess | undefined;

  $: activeTab = "details" as "details" | "cli" | "gui";

  const url = $page.url;

  const tab = url.searchParams.get("tab");
  const deeplink = url.searchParams.get("deeplink");
  onMount(() => {
    packagesStore.syncPackageData(pkg);
    if (pty && pty.guiURL) {
      activeTab = "gui";
    } else if (pty && pty.output.length) {
      activeTab = "cli";
    } else {
      activeTab = "details";
    }
  });

  let lastPackage = "";
  let unsubscribePty: (() => void) | null = null;

  $: {
    if (lastPackage !== pkg?.full_name && pkg) {
      lastPackage = pkg?.full_name;
      trackViewPackagePage(lastPackage, !!deeplink);

      unsubscribePty?.();
      unsubscribePty = ptys.subscribeToSubprocess(pkg?.full_name, (newPty) => {
        // if the gui url has just appeared, switch to the gui tab
        if (!pty?.guiURL && newPty?.guiURL) {
          activeTab = "gui";
        }
        // we need to copy this because we're looking for the delta of guiURL
        pty = { ...newPty };
      });
    }
  }
</script>

<div class="root">
  <header
    class="text-gray flex h-[52px] items-center justify-between border border-x-0 border-t-0 px-16"
  >
    <div>
      <a class="hover:text-white hover:opacity-80" href="/">{$t("common.home")}</a>
      ›
      <a class="hover:text-white hover:opacity-80" href="/?tab={tab || 'discover'}"
        >{tab ? $t(`tags.${tab}`).toLowerCase() : "discover"}</a
      >
      ›
      <span class="text-white">{pkg?.full_name}</span>
    </div>

    <div class="flex h-full">
      <Tab
        label="tabs.details"
        isActive={activeTab === "details"}
        onClick={() => (activeTab = "details")}
      />
      <Tab
        label="tabs.cli"
        isActive={activeTab === "cli"}
        onClick={() => (activeTab = "cli")}
        isDisabled={!pty}
      />
      <Tab
        label="tabs.gui"
        isActive={activeTab === "gui"}
        onClick={() => (activeTab = "gui")}
        isDisabled={!pty?.guiURL}
      />
    </div>
  </header>
  <div class="mx-16">
    <NotificationBar />
  </div>
  {#if pkg}
    <div class="h-full overflow-hidden pr-2" class:hidden={activeTab !== "details"}>
      <div class="mt-1 flex h-full overflow-y-auto px-16 pl-4 pt-4">
        <PackagePage on:openterminal={() => (activeTab = "cli")} {pkg} />
      </div>
    </div>
    <div class="flex h-full" class:hidden={activeTab !== "cli"}>
      <Terminal project={pkg?.full_name} />
    </div>
    <div class="flex h-full" class:hidden={activeTab !== "gui"}>
      <WebUI {pty} />
    </div>
  {:else}
    <Preloader />
  {/if}
</div>

<style>
  .root {
    /* magic number of pixels to fit the content without scrolling */
    height: calc(100vh - 102px);
    width: 100%;
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
