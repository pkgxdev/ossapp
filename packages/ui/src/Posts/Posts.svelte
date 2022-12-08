<script lang="ts">
	import '../app.css';
	import type { AirtablePost } from '../types';

	export let posts: AirtablePost[] = [];
</script>

<ul class="flex flex-col bg-black">
	{#each posts as article}
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
