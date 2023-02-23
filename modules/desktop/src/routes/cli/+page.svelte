<script>
	import '$appcss';
	import { t } from '$libs/translations'; 

	import PageHeader from '$components/page-header/page-header.svelte';
	import CliBanner from '$components/cli-banner/cli-banner.svelte';
	import BigBlackSpace from '$components/big-black-space/big-black-space.svelte';


</script>

<div>
	<PageHeader>{$t('cli.install')}</PageHeader>

	<section>
		<CliBanner />
	</section>

	<section class="mt-8">
		<BigBlackSpace />
	</section>
</div>
