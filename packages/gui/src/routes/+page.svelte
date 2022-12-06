<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import { backLink } from '$libs/stores';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import FeaturedPackages from '$components/FeaturedPackages/FeaturedPackages.svelte';
	import GettingStarted from '$components/GettingStarted/GettingStarted.svelte';
	import TopPackages from '$components/TopPackages/TopPackages.svelte';
	backLink.set('');
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
</div>

<style>
</style>
