<script>
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import { backLink } from '$libs/stores';
	import PackageBanner from '$components/PackageBanner/PackageBanner.svelte';
	import PackageReviews from '$components/PackageReviews/PackageReviews.svelte';
	backLink.set('/packages');

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div>
	<PageHeader>{data.title}</PageHeader>
	<section>
		<PackageBanner />
	</section>
	<section class="mt-8">
		<PackageReviews />
	</section>
</div>
