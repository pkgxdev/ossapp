<script lang="ts">
	import '$appcss';
	import { getAllPosts } from '$libs/api/mock';
	import type { AirtablePost } from '@tea/ui/types';
	import Posts from '@tea/ui/Posts/Posts.svelte';
	import PanelHeader from '@tea/ui/PanelHeader/PanelHeader.svelte';
	import { onMount } from 'svelte';

	let news: AirtablePost[] = [];

	onMount(async () => {
		news = await getAllPosts('news');
	});
</script>

<PanelHeader title="Open-source News" ctaLabel="Read more articles >" ctaLink="/" />
<Posts posts={news} />
