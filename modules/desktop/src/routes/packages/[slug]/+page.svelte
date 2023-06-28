<script lang="ts">
  import "$appcss";
  import { t } from "$libs/translations";
  import SkeletonLoader from "$components/skeleton-loader/skeleton-loader.svelte";
  import { page } from "$app/stores";
  import PackageBanner from "$components/package-banner/package-banner.svelte";
  import Tabs from "$components/tabs/tabs.svelte";
  import type { Tab } from "$libs/ui-types";
  import Bottles from "$components/bottles/bottles.svelte";
  import PackageMetas from "$components/package-metas/package-metas.svelte";
  import Markdown from "$components/markdown/markdown.svelte";
  import Preloader from "$components/preloader/preloader.svelte";
  import useDefaultBrowser from "$libs/utils/use-default-browser";

  /** @type {import('./$types').PageData} */
  export let data: { slug: string; content: string; title: string };

  import { packagesStore } from "$libs/stores";
  import { onMount } from "svelte";
  import NotificationBar from "$components/notification-bar/notification-bar.svelte";
  import { trackViewPackagePage } from "$libs/analytics";

  const { packageList } = packagesStore;

  $: pkg = $packageList.find((p) => p.slug === data?.slug);

  // let reviews: Review[];
  $: bottles = pkg?.bottles || [];
  $: versions = [...new Set(bottles.map((b) => b.version))];
  $: readme = pkg?.readme || { data: "", type: "md" };

  $: tabs = [
    readme?.data !== "" && {
      label: $t("common.details"),
      component: Markdown,
      props: { source: readme, hook: useDefaultBrowser }
    },
    bottles?.length && {
      label: `${$t("common.versions")} (${versions.length || 0})`,
      component: Bottles,
      props: {
        bottles
      }
    }
  ].filter((t) => t && t?.label) as unknown as Tab[];

  const url = $page.url;

  const tab = url.searchParams.get("tab");
  const deeplink = url.searchParams.get("deeplink");
  onMount(() => {
    packagesStore.syncPackageData(pkg);
  });

  let lastPackage = "";
  $: {
    if (lastPackage !== pkg?.full_name && pkg) {
      lastPackage = pkg.full_name;
      trackViewPackagePage(lastPackage, !!deeplink);
    }
  }
</script>

<header class="mx-16 mb-4 border border-x-0 border-t-0 py-5 text-gray">
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
      <PackageBanner {pkg} />
    </section>

    <section class="mt-8 flex gap-8">
      <div class="w-2/3">
        {#if tabs.length === 0}
          <div class="flex w-full justify-center py-10">
            <SkeletonLoader />
          </div>
        {/if}
        <Tabs {tabs} defaultTab={$t("common.details")} />
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
