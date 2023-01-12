<script lang="ts">
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import { packagesReviewStore } from '$libs/stores';
	import PackageBanner from '$components/PackageBanner/PackageBanner.svelte';
	import PackageReviews from '$components/PackageReviews/PackageReviews.svelte';
	import type { Review } from '@tea/ui/types';
	import SuggestedPackages from '$components/SuggestedPackages/SuggestedPackages.svelte';

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
</script>

<div>
	<PageHeader>{pkg.full_name}</PageHeader>
	<section>
		<PackageBanner {pkg} />
	</section>
	<section class="mt-8">
		<PackageReviews reviews={reviews || []} />
	</section>
	{#if pkg}
		<section class="mt-8">
			<SuggestedPackages {pkg} />
		</section>
	{/if}
</div>
