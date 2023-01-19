<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import type { Snippet, Tab } from '../types';
	import Tabs from '../Tabs/Tabs.svelte';
	import Code from './Code.svelte';

	export let snippet: Snippet;

	let active = false;

	let tabs: Tab[] = [];
	onMount(() => {
		tabs = snippet.files.map((file) => ({
			label: file.name,
			component: Code,
			props: {
				text: file.data,
				language: file.language
			}
		}));
	});
</script>

<header class="flex items-center gap-4 px-4">
	<button class={`${active ? 'rotate-90' : 'hover:rorate-90'}`} on:click={() => (active = !active)}>
		<i class="icon-enter-arrow" />
	</button>
	<figure class="h-8 w-8 overflow-clip rounded-full bg-gray">
		{#if snippet.avatar_url}
			<img src={snippet.avatar_url} alt={snippet.user} />
		{/if}
	</figure>
	<article class="flex-grow text-primary">
		<h3>{snippet.user}/{snippet.files[0].name}</h3>
		<date class="text-xs">{snippet.created_at}</date>
	</article>
	<p class="font-machina text-xs text-primary">{snippet.files.length} file/s</p>
	<p class="font-machina text-xs text-primary">{snippet.forks.length} forks</p>
	<p class="font-machina text-xs text-primary">{snippet.comments.length} comments</p>
	<p class="font-machina text-xs text-primary">{snippet.stars} stars</p>
</header>
{#if active}
	<section class="mt-4">
		{#if tabs.length}
			<Tabs {tabs} />
		{/if}
	</section>
{/if}
