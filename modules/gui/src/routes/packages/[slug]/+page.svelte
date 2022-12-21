<script lang="ts">
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import { backLink } from '$libs/stores';
	import PackageBanner from '$components/PackageBanner/PackageBanner.svelte';
	// import PackageReviews from '$components/PackageReviews/PackageReviews.svelte';
	backLink.set('/packages');

	/** @type {import('./$types').PageData} */
	export let data;

	import { packages, featuredPackages } from '$libs/stores';

	import type { Package } from '@tea/ui/types';

	let pkg: Package;

	// let reviews: Review[];

	const setPkg = (pkgs: Package[]) => {
		const foundPackage = pkgs.find(({ slug }) => slug === data?.slug) as Package;
		if (!pkg && foundPackage) {
			pkg = foundPackage;
		}
		// TODO: uncomment when api is ready
		// if (!reviews && pkg) {
		// 	packagesReviewStore.subscribe(pkg.full_name, (updatedReviews) => {
		// 		reviews = updatedReviews;
		// 	});
		// }
	};

	packages.subscribe(setPkg);
	featuredPackages.subscribe(setPkg);
</script>

<div>
	<PageHeader>{pkg.full_name}</PageHeader>
	<section>
		<PackageBanner {pkg} />
	</section>
	<!-- 
	TODO: uncomment when api is ready	
	<section class="mt-8">
		<PackageReviews reviews={reviews || []} />
	</section>
	-->
</div>
