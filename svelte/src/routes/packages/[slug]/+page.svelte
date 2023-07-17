<script lang="ts">
  import "$appcss";
  import { t } from "$libs/translations";
  import SkeletonLoader from "$components/skeleton-loader/skeleton-loader.svelte";
  import { page } from "$app/stores";
  import PackageBanner from "$components/package-banner/package-banner.svelte";
  import Tabs from "$components/tabs/tabs.svelte";
  import type { Tab } from "$libs/types";
  import Bottles from "$components/bottles/bottles.svelte";
  import PackageMetas from "$components/package-metas/package-metas.svelte";
  import Markdown from "$components/markdown/markdown.svelte";
  import Preloader from "$components/preloader/preloader.svelte";
  import useDefaultBrowser from "$libs/utils/use-default-browser";
  import Terminal from "$components/terminal/terminal.svelte";
  import WebUI from "$components/web-ui/web-ui.svelte";
  import { tabStore } from "$libs/stores";

  /** @type {import('./$types').PageData} */
  export let data: { slug: string; content: string; title: string };

  import { packagesStore, ptys } from "$libs/stores";
  import { onMount } from "svelte";
  import NotificationBar from "$components/notification-bar/notification-bar.svelte";
  import { trackViewPackagePage } from "$libs/analytics";
  import type { TeaSubprocess } from "$libs/stores/ptys";

  const { packageList } = packagesStore;
  const { setActiveTab } = tabStore;

  $: pkg = $packageList.find((p) => p.slug === data?.slug);
  $: bottles = pkg?.bottles || [];
  $: versions = [...new Set(bottles.map((b) => b.version))];
  $: readme = pkg?.readme || { data: "", type: "md" };

  $: pty = undefined as TeaSubprocess | undefined;

  $: tabs = [
    readme?.data !== "" && {
      id: "details",
      label: $t("tabs.details"),
      component: Markdown,
      props: { source: readme, hook: useDefaultBrowser }
    },
    bottles?.length && {
      id: "versions",
      label: `${$t("tabs.versions")} (${versions.length || 0})`,
      component: Bottles,
      props: {
        bottles
      }
    },
    {
      id: "cli",
      label: $t("tabs.cli"),
      component: Terminal,
      props: { project: pkg?.full_name },
      hidden: !pty
    },
    {
      id: "gui",
      label: $t("tabs.gui"),
      component: WebUI,
      props: { pty },
      hidden: !pty?.guiURL
    }
  ].filter((t) => t && t?.label) as unknown as Tab[];

  const url = $page.url;

  const tab = url.searchParams.get("tab");
  const deeplink = url.searchParams.get("deeplink");
  onMount(() => {
    packagesStore.syncPackageData(pkg);
    if (pty && pty.guiURL) {
      setActiveTab("gui");
    } else if (pty && pty.output.length) {
      setActiveTab("cli");
    } else {
      setActiveTab(tabs[0]?.id);
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
          setActiveTab("gui");
        }
        // we need to copy this because we're looking for the delta of guiURL
        pty = { ...newPty };
      });
    }
  }
</script>

<header class="text-gray mx-16 mb-4 border border-x-0 border-t-0 py-5">
  <a class="hover:text-white hover:opacity-80" href="/">{$t("common.home")}</a>
  ›
  <a class="hover:text-white hover:opacity-80" href="/?tab={tab || 'discover'}"
    >{tab ? $t(`tags.${tab}`).toLowerCase() : "discover"}</a
  >
  ›
  <span class="text-white">{pkg?.full_name}</span>
</header>
<div class="mx-16 mb-4">
  <NotificationBar />
</div>
{#if pkg}
  <div class="px-16">
    <section>
      <PackageBanner {pkg} on:openterminal={() => setActiveTab("cli")} />
    </section>

    <section class="mt-8 flex gap-8">
      <div class="w-2/3">
        {#if tabs.length === 0}
          <div class="flex w-full justify-center py-10">
            <SkeletonLoader />
          </div>
        {/if}
        <Tabs {tabs} />
      </div>
      <div class="w-1/3">
        {#if pkg}
          <PackageMetas {pkg} />
        {/if}
      </div>
    </section>
  </div>
{:else}
  <Preloader />
{/if}
