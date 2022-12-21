<script>
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import SearchPackages from '$components/SearchPackages/SearchPackages.svelte';
	import { backLink } from '$libs/stores';
	backLink.set('/');
</script>

<div>
	<PageHeader>Packages</PageHeader>
	<SearchPackages />
</div>
