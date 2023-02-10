<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import EssentialWorkshops from '$components/EssentialWorkshops/EssentialWorkshops.svelte';
	import Packages from '$components/Packages/Packages.svelte';
	import News from '$components/News/News.svelte';

	import HeaderCard from '@tea/ui/HeaderCard/HeaderCard.svelte';
	import ListAction from '@tea/ui/ListAction/ListAction.svelte';
</script>

<div>
	<PageHeader coverUrl="/images/headers/header_bg_1.png">Discover</PageHeader>
	<section class="mt-8 mb-8">
		<Packages title="FOUNDATION ESSENTIALS" category="foundation_essentials" />
	</section>
	<PageHeader coverUrl="/images/headers/header_bg_1.png">ASSET TYPE</PageHeader>
	<section class="mt-8 mb-8 flex gap-4">
		<div>
			<HeaderCard
				title="Browser Packages"
				imgUrl="/images/bored-ape.png"
				ctaUrl="/packages"
				ctaLabel="Browse packages >"
				articleTitle="What are packages?"
				description="Collections of files aggregated to form larger frameworks & functions. Think Python or Node.js."
			/>
			<ListAction title="Top packages this week" mainCtaTitle="VIEW ALL PACKAGES" />
		</div>
		<div>
			<HeaderCard
				title="Browse Scripts"
				imgUrl="/images/bored-ape.png"
				ctaUrl="/packages"
				ctaLabel="Browse scripts >"
				articleTitle="What are scripts?"
				description="Invisible applications that chain packages together in order to perform cool actions on your computer."
			/>
			<ListAction title="Top scripts this week" mainCtaTitle="VIEW ALL SCRIPTS" />
		</div>
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
