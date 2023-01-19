<script lang="ts">
	import '$appcss';
	import { onMount } from 'svelte';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import { packagesReviewStore } from '$libs/stores';
	import PackageBanner from '$components/PackageBanner/PackageBanner.svelte';
	import PackageReviews from '$components/PackageReviews/PackageReviews.svelte';
	import type { Review, Bottle } from '@tea/ui/types';
	import SuggestedPackages from '$components/SuggestedPackages/SuggestedPackages.svelte';
	import Tabs from '@tea/ui/Tabs/Tabs.svelte';
	import type { Tab } from '@tea/ui/types';
	import Badges from '$components/Badges/Badges.svelte';
	import Bottles from '@tea/ui/Bottles/Bottles.svelte';
	import { getPackageBottles } from '@api';
	import PackageDetail from '$components/PackageDetail/PackageDetail.svelte';
	import PackageMetas from '@tea/ui/PackageMetas/PackageMetas.svelte';
	import Markdown from '@tea/ui/Markdown/Markdown.svelte';
	/** @type {import('./$types').PageData} */
	export let data;

	import { packagesStore, featuredPackages } from '$libs/stores';

	import type { Package } from '@tea/ui/types';

	let pkg: Package;

	let reviews: Review[];
	let bottles: Bottle[] = [];
	let versions: string[] = [];

	let tabs: Tab[] = [];

	const setPkg = (pkgs: Package[]) => {
		const foundPackage = pkgs.find(({ slug }) => slug === data?.slug) as Package;
		if (!pkg && foundPackage) {
			pkg = foundPackage;
			tabs.push({
				label: 'details',
				component: Markdown,
				props: { pkg }
			});
		}

		if (!reviews && pkg) {
			packagesReviewStore.subscribe(pkg.full_name, (updatedReviews) => {
				reviews = updatedReviews;
			});
		}
	};

	packagesStore.subscribe(setPkg);
	featuredPackages.subscribe(setPkg);

	onMount(async () => {
		try {
			const newBottles = await getPackageBottles(pkg.full_name);
			const newVersion = newBottles.map((b) => b.version);
			versions = [...new Set(newVersion)];

			bottles.push(...newBottles);
			console.log('sync tabs:', versions);
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
			console.log(tabs);
		} catch (err) {
			console.error(err);
		}
	});
</script>

<div>
	<PageHeader coverUrl={pkg.thumb_image_url}>{pkg.full_name}</PageHeader>
	<section>
		<PackageBanner {pkg} />
	</section>

	<section class="mt-8 flex gap-8">
		<div class="w-2/3">
			<Tabs class="bg-black" {tabs} />
		</div>
		<div class="w-1/3">
			<PackageMetas />
		</div>
	</section>
	<PageHeader class="mt-8" coverUrl="/images/headers/header_bg_1.png">SNIPPETS</PageHeader>
	<section class="mt-8 h-64 bg-gray">snippets</section>
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
