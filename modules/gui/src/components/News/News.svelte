<script lang="ts">
	import '$appcss';
	import { getAllPosts } from '@api';
	import type { AirtablePost } from '@tea/ui/types';
	import Posts from '@tea/ui/Posts/Posts.svelte';
	import PanelHeader from '@tea/ui/PanelHeader/PanelHeader.svelte';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import { onMount } from 'svelte';

	let news: AirtablePost[] = [];

	onMount(async () => {
		news = await getAllPosts('news');
	});
</script>

<PanelHeader title="Open-source News" ctaLabel="Read more articles >" ctaLink="/" />
{#if news.length}
	<Posts posts={news} linkTarget="_blank" />
{:else}
	<section class="h-64 border border-gray bg-black p-4">
		<Preloader />
	</section>
{/if}
