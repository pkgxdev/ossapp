<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations'; 
	import { postsStore } from '$libs/stores';
	import type { AirtablePost } from '@tea/ui/types';
	import Posts from '@tea/ui/posts/posts.svelte';
	import PanelHeader from '@tea/ui/panel-header/panel-header.svelte';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';

	let news: AirtablePost[] = [];

	postsStore.subscribeByTag('news', (posts) => (news = posts));
</script>

<PanelHeader title={$t("home.os-news-title")} ctaLabel={`${$t("post.article-more-cta")} >`} ctaLink="/" />
{#if news.length}
	<Posts posts={news} linkTarget="_blank" />
{:else}
	<section class="border-gray h-64 border bg-black p-4">
		<Preloader />
	</section>
{/if}
