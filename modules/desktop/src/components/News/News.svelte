<script lang="ts">
	import '$appcss';
	import { postsStore } from '$libs/stores';
	import type { AirtablePost } from '@tea/ui/types';
	import Posts from '@tea/ui/Posts/Posts.svelte';
	import PanelHeader from '@tea/ui/PanelHeader/PanelHeader.svelte';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';

	let news: AirtablePost[] = [];

	postsStore.subscribeByTag('news', (posts) => (news = posts));
</script>

<PanelHeader title="Open-source News" ctaLabel="Read more articles >" ctaLink="/" />
{#if news.length}
	<Posts posts={news} linkTarget="_blank" />
{:else}
	<section class="border-gray h-64 border bg-black p-4">
		<Preloader />
	</section>
{/if}
