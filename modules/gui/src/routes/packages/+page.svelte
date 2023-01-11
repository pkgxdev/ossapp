<script>
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import SearchPackages from '$components/SearchPackages/SearchPackages.svelte';
	import { navStore } from '$libs/stores';
	navStore.set('/');
</script>

<div>
	<PageHeader>Packages</PageHeader>
	<SearchPackages />
</div>
