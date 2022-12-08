<script lang="ts">
	import '$appcss';
	import { getAllPosts } from '$libs/api/mock';
	import type { AirtablePost } from '@tea/ui/types';
	import { onMount } from 'svelte';

	let news: AirtablePost[] = [];

	onMount(async () => {
		news = await getAllPosts();
	});
</script>

<header class="flex items-center justify-between border border-gray bg-black p-4 text-primary">
	<span>OPEN-SOURCE NEWS</span>
	<a href="/" class="font-sono text-sm underline">Read more articles ></a>
</header>

<ul class="flex flex-col bg-black">
	{#each news as article}
		<li class="border border-t-0 border-gray p-4">
			<article class="flex border border-gray">
				<figure class="w-1/3">
					<img src={article.thumb_image_url} alt={article.title} />
				</figure>
				<section class="p-4 font-sono">
					<h1 class="text-xl text-primary">{article.title}</h1>
					<p class="my-4 text-sm">{article.short_description}</p>
					<a href={article.link} class="text-sm text-primary underline">Read more ...</a>
				</section>
			</article>
		</li>
	{/each}
</ul>
