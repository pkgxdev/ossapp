<script lang="ts">
	import '$appcss';
	import PageHeader from '$components/page-header/page-header.svelte';
	import PackageBanner from '$components/package-banner/package-banner.svelte';
	import type { Review, Bottle } from '@tea/ui/types';
	import SuggestedPackages from '$components/suggested-packages/suggested-packages.svelte';
	import Tabs from '@tea/ui/tabs/tabs.svelte';
	import type { Tab } from '@tea/ui/types';
	import Bottles from '@tea/ui/bottles/bottles.svelte';
	import PackageMetas from '@tea/ui/package-metas/package-metas.svelte';
	import Markdown from '@tea/ui/markdown/markdown.svelte';
	import PackageSnippets from '@tea/ui/package-snippets/package-snippets.svelte';
	import type { GUIPackage } from '$libs/types';

	/** @type {import('./$types').PageData} */
	export let data;

	import { packagesStore } from '$libs/stores';

	let pkg: GUIPackage;

	let reviews: Review[];
	let bottles: Bottle[] = [];
	let versions: string[] = [];
	let readme: string;

	let tabs: Tab[] = [];

	packagesStore.subscribeToPackage(data?.slug, (p) => {
		pkg = p;

		if (!bottles.length && pkg.bottles) {
			const newVersion =  pkg.bottles.map((b) => b.version);
			versions = [...new Set(newVersion)];
			bottles.push(...pkg.bottles);
			tabs = [
				...tabs,
				{
					label: `versions (${versions.length || 0})`,
					component: Bottles,
					props: {
						bottles
					}
				}
			];
		}

		if (!readme && pkg.readme_md) {
			readme = pkg.readme_md;
			tabs = [
				{
					label: 'details',
					component: Markdown,
					props: { pkg, source: readme }
				},
				...tabs,
			];
		}
	});

</script>

<div>
	<section>
		<PackageBanner {pkg} />
	</section>

	<section class="mt-8 flex gap-8">
		<div class="w-2/3">
			<Tabs class="bg-black" {tabs} />
		</div>
		<div class="w-1/3">
			{#if pkg}
				<PackageMetas {pkg} />
			{/if}
		</div>
	</section>
	<PageHeader class="mt-8" coverUrl="/images/headers/header_bg_1.png">SNIPPETS</PageHeader>
	<section class="mt-8">
		<PackageSnippets />
	</section>
	<!-- <section class="mt-8">
		<PackageReviews reviews={reviews || []} />
	</section> -->
	{#if pkg}
		<PageHeader class="mt-8" coverUrl="/images/headers/header_bg_1.png"
			>YOU MAY ALSO LIKE...</PageHeader
		>
		<section class="mt-8">
			<SuggestedPackages {pkg} />
		</section>
	{/if}
</div>
