<script lang="ts">
	import '../app.css';
	import ImgLoader from '../ImgLoader/ImgLoader.svelte';

	export let width = 0;
	export let imageUrl = '';
	export let title = '';
	export let subTitle = '';
</script>

<figure class="gallery-item relative h-full w-full" style={`width:${width}px`}>
	<ImgLoader
		class="featured-img"
		src={!imageUrl.includes('https://tea.xyz')
			? 'https://tea.xyz/Images/package-thumb-nolabel4.jpg'
			: imageUrl}
		alt={title}
	/>

	<article class="card-thumb-label">
		<i class="icon-tea-logo-iconasset-1">
			<!-- TODO: replace with icon.svg -->
		</i>
		<h3 class="text-3xl">{title}</h3>
		{#if subTitle}
			<h4 class="mt-2 text-lg">&#x2022;&nbsp;{subTitle}</h4>
		{/if}
	</article>
</figure>

<style>
	.gallery-item :global(.featured-img) {
		box-shadow: 0px 0px 12px #0c0c0c !important;
		width: 100%;
		height: 100%;
	}
	.card-thumb-label i {
		font-size: 1.5vw;
		color: black;
	}

	.card-thumb-label h3 {
		color: black;
		line-height: 1.8vw;
		margin: 0px 0px 0.5vw 0vw;
		padding: 0px;
	}

	.card-thumb-label {
		position: absolute;
		background: rgba(255, 255, 255, 0.9);
		left: 0;
		bottom: 20px;
		padding: 1.116vw;
		text-align: left;
		min-width: 40%;
		height: 40%;
	}

	.card-thumb-label h4 {
		color: black;
	}
</style>
