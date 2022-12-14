<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import { backLink } from '$libs/stores';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import FeaturedPackages from '$components/FeaturedPackages/FeaturedPackages.svelte';
	import GettingStarted from '$components/GettingStarted/GettingStarted.svelte';
	import TopPackages from '$components/TopPackages/TopPackages.svelte';
	import News from '$components/News/News.svelte';
	import CategorizedPackages from '$components/CategorizedPackages/CategorizedPackages.svelte';
	backLink.set('');
	console.log("test", window.location)
</script>

<div>
	<PageHeader>Discover</PageHeader>
	<section>
		<FeaturedPackages />
	</section>
	<section class="mt-8">
		<GettingStarted />
	</section>
	<section class="mt-8">
		<TopPackages />
	</section>
	<section class="mt-8">
		<CategorizedPackages />
	</section>
	<section class="mt-8">
		<News />
	</section>
</div>

<style>
</style>
