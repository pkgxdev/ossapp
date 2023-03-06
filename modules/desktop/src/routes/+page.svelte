<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations'; 
	import PageHeader from '$components/page-header/page-header.svelte';
	import EssentialWorkshops from '$components/essential-workshops/essential-workshops.svelte';
	import Packages from '$components/packages/packages.svelte';
	import News from '$components/news/news.svelte';
</script>

<div>
	<PageHeader coverUrl="/images/headers/header_bg_1.png">{$t("home.discover-title")}</PageHeader>
	<section class="mt-8 mb-8">
		<Packages title={$t("package.foundation-essentials-title")} category="foundation_essentials" />
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
