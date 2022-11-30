<script type="ts">
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import { backLink } from '$libs/stores';
	import PackageBanner from '$components/PackageBanner/PackageBanner.svelte';
	import PackageReviews from '$components/PackageReviews/PackageReviews.svelte';
	backLink.set('/packages');

	/** @type {import('./$types').PageData} */
	export let data;

	import { packages, featuredPackages } from '$libs/stores';

	import type { Package } from '@tea/ui/types';

	let pkg: Package;

	const setPkg = (pkgs: Package[]) => {
		const foundPackage = pkgs.find(({ slug }) => slug === data?.slug) as Package;
		if (!pkg && foundPackage) {
			pkg = foundPackage;
		}
	};

	packages.subscribe(setPkg);
	featuredPackages.subscribe(setPkg);
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
