<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import EssentialWorkshops from '$components/EssentialWorkshops/EssentialWorkshops.svelte';
	import Packages from '$components/Packages/Packages.svelte';
	import News from '$components/News/News.svelte';
	import CategorizedPackages from '$components/CategorizedPackages/CategorizedPackages.svelte';
</script>

<div>
	<PageHeader coverUrl="/images/headers/header_bg_1.png">Discover</PageHeader>
	<section class="mt-8 mb-8">
		<Packages title="FOUNDATIN ESSENTIALS" />
	</section>
	<PageHeader coverUrl="/images/headers/header_bg_1.png">TUTORIALS</PageHeader>
	<section class="mt-8 mb-8">
		<EssentialWorkshops title="WORKSHOPS TO GET STARTED" ctaLabel="Read more articles >" />
	</section>
	<PageHeader coverUrl="/images/headers/header_bg_1.png">OPEN-SOURCE NEWS</PageHeader>
	<section class="mt-8">
		<News />
	</section>
</div>
