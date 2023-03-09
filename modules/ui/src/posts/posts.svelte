<script lang="ts">
	import "../app.css";
	import type { AirtablePost } from "../types";
	import ImgLoader from "../img-loader/img-loader.svelte";

	export let posts: AirtablePost[] = [];
	export let linkTarget = "_blank";

	const tagColorDict: { [key: string]: string } = {
		ARTICLE: "#FF00FF",
		WORKSHOP: "#2675F5"
	};
</script>

<ul class="flex flex-col bg-black">
	{#each posts as article}
		<a href={article.link} target={linkTarget}>
			<li class="border border-t-0 border-gray p-4 ">
				<article class="flex border border-gray transition-all hover:bg-gray">
					<ImgLoader
						style="height: 232px; width: 194px"
						class="pkg-image p-2"
						src={article.thumb_image_url}
						alt={article.title}
					/>
					<section class="flex-grow p-4 font-sono">
						<ul class="mb-4 flex">
							{#each article.tags as tag}
								<li class="rounded-sm px-2" style={`background-color: ${tagColorDict[tag]}`}>
									{tag.toLowerCase()}
								</li>
							{/each}
						</ul>
						<h1 class="text-2xl text-primary">{article.title}</h1>
						<p class="my-4 text-sm line-clamp-4">{article.short_description}</p>
					</section>
				</article>
			</li>
		</a>
	{/each}
</ul>
