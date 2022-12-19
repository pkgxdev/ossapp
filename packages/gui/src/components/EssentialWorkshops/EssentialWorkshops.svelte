<script lang="ts">
	import '$appcss';
	import { getAllPosts } from '@api';
	import type { AirtablePost } from '@tea/ui/types';
	import Posts from '@tea/ui/Posts/Posts.svelte';
	import PanelHeader from '@tea/ui/PanelHeader/PanelHeader.svelte';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import { onMount } from 'svelte';

	let courses: AirtablePost[] = [];

	onMount(async () => {
		courses = await getAllPosts('course');
	});
</script>

<PanelHeader title="Essential Workshops" ctaLabel="View all" ctaLink="/" />
{#if courses.length}
	<Posts posts={courses} />
{:else}
	<section class="h-64 border bg-black border-gray p-4">
		<Preloader />
	</section>
{/if}
