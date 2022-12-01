<script type="ts">
	import '../app.css';

	type Article = {
		title: string;
		img_url: string;
		copy: string;
		cta_label: string;
		link?: string;
	};

	export let content: Article;
	export let onClick: undefined | (() => void) = undefined;
</script>

<section class="border border-gray">
	<header class="bg-accent text-white p-2 uppercase">{content.title}</header>
	<figure class="h-24">
		<img class="object-cover h-24 w-full" src={content.img_url} alt={content.title} />
	</figure>
	<article class="p-4">
		<p class="text-xs font-sono line-clamp-3">{content.copy}</p>
		{#if content.link}
			<a href={content.link || '#'}>
				<button class="text-primary mt-2">{content.cta_label}</button>
			</a>
		{:else if onClick}
			<button on:click={onClick} class="text-primary mt-2">{content.cta_label}</button>
		{:else}
			<button disabled class="text-gray mt-2">{content.cta_label}</button>
		{/if}
	</article>
</section>
