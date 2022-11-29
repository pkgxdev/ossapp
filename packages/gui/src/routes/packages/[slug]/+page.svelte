<script type="ts">
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import { backLink } from '$libs/stores';
	import PackageBanner from '$components/PackageBanner/PackageBanner.svelte';
	import PackageReviews from '$components/PackageReviews/PackageReviews.svelte';
	backLink.set('/packages');

	/** @type {import('./$types').PageData} */
	export let data;

	import { packages as packagesStore, initializePackages } from '$libs/stores';

	import type { Package } from '@tea/ui/types';

	let pkg: Package;

	packagesStore.subscribe((allPackages) => {
		const foundPackage = allPackages.find(({ slug }) => slug === data?.slug) as Package;
		if (foundPackage) {
			pkg = foundPackage;
		}
	});
</script>

<div>
	<PageHeader>{pkg.full_name}</PageHeader>
	<section>
		<PackageBanner {pkg} />
	</section>
	<section class="mt-8">
		<PackageReviews />
	</section>
</div>
