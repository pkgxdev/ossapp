<script lang="ts">
	import '$appcss';
	import { getAllPosts } from '$libs/api/mock';
	import type { AirtablePost } from '@tea/ui/types';
	import Posts from '@tea/ui/Posts/Posts.svelte';
	import PanelHeader from '@tea/ui/PanelHeader/PanelHeader.svelte';
	import { onMount } from 'svelte';

	let courses: AirtablePost[] = [];

	onMount(async () => {
		courses = await getAllPosts('course');
	});
</script>

<PanelHeader title="Essential Workshops" ctaLabel="View all" ctaLink="/" />
<Posts posts={courses} />
