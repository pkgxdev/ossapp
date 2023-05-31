<script lang="ts">
  import "$appcss";
  import { t } from "$libs/translations";
  import SkeletonLoader from "@tea/ui/skeleton-loader/skeleton-loader.svelte";
  import { page } from "$app/stores";
  // import PageHeader from '$components/page-header/page-header.svelte';
  import PackageBanner from "$components/package-banner/package-banner.svelte";
  // import SuggestedPackages from '$components/suggested-packages/suggested-packages.svelte';
  import Tabs from "@tea/ui/tabs/tabs.svelte";
  import type { Tab } from "@tea/ui/types";
  import Bottles from "@tea/ui/bottles/bottles.svelte";
  import PackageMetas from "@tea/ui/package-metas/package-metas.svelte";
  import Markdown from "@tea/ui/markdown/markdown.svelte";
  // import PackageSnippets from '@tea/ui/package-snippets/package-snippets.svelte';
  import Preloader from "@tea/ui/Preloader/Preloader.svelte";
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
    <!-- <PageHeader class="mt-8" coverUrl="/images/headers/header_bg_1.png">SNIPPETS</PageHeader> -->
    <!-- <section class="mt-8">
			<PackageSnippets />
		</section> -->
    <!-- <section class="mt-8">
			<PackageReviews reviews={reviews || []} />
		</section> -->
    <!-- {#if pkg}
			<PageHeader class="mt-8" coverUrl="/images/headers/header_bg_1.png"
				>YOU MAY ALSO LIKE...</PageHeader
			>
			<section class="mt-8">
				<SuggestedPackages {pkg} />
			</section>
		{/if} -->
  </div>
{:else}
  <Preloader />
{/if}
