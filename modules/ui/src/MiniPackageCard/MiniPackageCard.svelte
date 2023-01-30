<script lang="ts">
	import '../app.css';
	import type { Package } from '../types';

	import ImgLoader from '../ImgLoader/ImgLoader.svelte';

	export let pkg: Package;
	export let ctaLabel: string;
	export let link = '';

	export let onClickCTA = () => {
		console.log('do nothing');
	};
</script>

<section class="box-content flex h-24 w-full border border-gray font-sono">
	<figure class="relative w-24">
		<ImgLoader
			class="pkg-image object-contain"
			src={!pkg.thumb_image_url.includes('https://tea.xyz')
				? 'https://tea.xyz/Images/package-thumb-nolabel4.jpg'
				: pkg.thumb_image_url}
			alt={pkg.name}
		/>
		<div class="absolute top-0 h-8 w-8 bg-accent text-center text-xs text-white">
			<span class="leading-8">&#8249;/&#8250;</span>
		</div>
	</figure>
	<footer class="flex-grow px-2 text-white">
		<h3 class="text-base uppercase">{pkg.name}</h3>
		{#if pkg.maintainer}
			<h4 class="text-xs">&#x2022;&nbsp;{pkg.maintainer}</h4>
		{/if}
		<div>
			<p>
				<span class="text-xs text-gray"
					>V&NonBreakingSpace;{pkg.version} {pkg?.bottles?.length ? `| ${pkg.bottles.length} bottles` : ''}</span
				>
			</p>
		</div>
		{#if link}
			<a href={link}>
				<button class="h-6 w-full font-machina text-xs">{ctaLabel}</button>
			</a>
		{:else}
			<button class="h-6 w-full font-machina text-xs" on:click={onClickCTA}>{ctaLabel}</button>
		{/if}
	</footer>
</section>

<style>
	section {
		background-color: #1a1a1a;
		transition: all 0.3s;
		width: 100%;
	}

	figure {
		position: relative;
	}

	button {
		background-color: #1a1a1a;
		border: 0.5px solid #ffffff;
		color: #fff;
		text-decoration: none;
		text-transform: uppercase;
		min-width: 120px;
		transition: 0.1s linear;
	}

	button:hover {
		background-color: #8000ff;
		box-shadow: inset 0vw 0vw 0vw 0.223vw #1a1a1a !important;
	}
</style>
