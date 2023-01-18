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

	/** @type {import('./$types').PageData} */
	export let data;

	import { packagesStore, featuredPackages } from '$libs/stores';

	import type { Package } from '@tea/ui/types';

	let pkg: Package;

	let reviews: Review[];

	const setPkg = (pkgs: Package[]) => {
		const foundPackage = pkgs.find(({ slug }) => slug === data?.slug) as Package;
		if (!pkg && foundPackage) {
			pkg = foundPackage;
		}

		if (!reviews && pkg) {
			packagesReviewStore.subscribe(pkg.full_name, (updatedReviews) => {
				reviews = updatedReviews;
			});
		}
	};

	packagesStore.subscribe(setPkg);
	featuredPackages.subscribe(setPkg);

	let bottles: Bottle[] = [];
	const tabs: Tab[] = [
		{
			label: 'details',
			component: Badges,
			props: {
				arg1: 'A1'
			}
		},
		{
			label: 'versions',
			component: Bottles,
			props: {
				bottles
			}
		}
	];

	onMount(async () => {
		try {
			const newBottles = await getPackageBottles(pkg.full_name);
			bottles.push(...newBottles);
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
		<div class="w-2/3 bg-black">
			<Tabs {tabs} />
		</div>
		<div class="h-64 w-1/3 bg-gray">metas</div>
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
