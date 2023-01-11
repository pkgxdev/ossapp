<script>
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import CliBanner from '$components/CliBanner/CliBanner.svelte';
	import BigBlackSpace from '$components/BigBlackSpace/BigBlackSpace.svelte';
	import { navStore } from '$libs/stores';
	navStore.set('/');
</script>

<div>
	<PageHeader>INSTALL TEA</PageHeader>

	<section>
		<CliBanner />
	</section>

	<section class="mt-8">
		<BigBlackSpace />
	</section>
</div>
