<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations'; 
	import PageHeader from '$components/page-header/page-header.svelte';
	import EssentialWorkshops from '$components/essential-workshops/essential-workshops.svelte';
	import Packages from '$components/packages/packages.svelte';
	import News from '$components/news/news.svelte';

	import HeaderCard from '@tea/ui/header-card/header-card.svelte';
	import TopPackages from '$components/top-packages/top-packages.svelte';
	import TopScripts from '$components/top-scripts/top-scripts.svelte';
</script>

<div>
	<PageHeader coverUrl="/images/headers/header_bg_1.png">{$t("home.discover-title")}</PageHeader>
	<section class="mt-8 mb-8">
		<Packages title={$t("package.foundation-essentials-title")} category="foundation_essentials" />
	</section>
	<PageHeader coverUrl="/images/headers/header_bg_1.png">{$t("home.asset-title")}</PageHeader>
	<section class="mt-8 mb-8 flex gap-4">
		<div>
			<HeaderCard
				title={$t("package.browse-cta")}
				imgUrl="/images/bored-ape.png"
				ctaUrl="/packages"
				ctaLabel={`${$t("package.browse-cta")} >`}
				articleTitle={$t("package.what-title")}
				description={$t("package.short-description")}
			/>
			<TopPackages />
		</div>
		<div>
			<HeaderCard
				title={$t("script.browse-cta")}
				imgUrl="/images/bored-ape.png"
				ctaUrl="/packages"
				ctaLabel={`${$t("script.browse-cta")} >`}
				articleTitle={$t("script.what-title")}
				description={$t("script.short-description")}
			/>
			<TopScripts/>
		</div>
	</section>
	<PageHeader coverUrl="/images/headers/header_bg_1.png">{$t("home.tutorials-title")}</PageHeader>
	<section class="mt-8 mb-8">
		<EssentialWorkshops title={$t("post.workshops-title")} ctaLabel={`${$t('post.article-more-cta')} >`} />
	</section>
	<PageHeader coverUrl="/images/headers/header_bg_1.png">{$t("home.os-news-title")}</PageHeader>
	<section class="mt-8">
		<News />
	</section>
</div>
