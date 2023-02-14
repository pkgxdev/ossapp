<script>
	import '$appcss';
	import PageHeader from '$components/page-header/page-header.svelte';
	import CliBanner from '$components/cli-banner/cli-banner.svelte';
	import BigBlackSpace from '$components/big-black-space/big-black-space.svelte';
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
