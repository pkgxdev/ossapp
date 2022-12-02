<script lang="ts">
	import '$appcss';
	import { onDestroy, onMount } from 'svelte';
	import { watchResize } from 'svelte-watch-resize';
	import type { Package } from '@tea/ui/types';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import FeaturedPackage from './FeaturedPackage.svelte';
	import {
		featuredPackages as featuredPackagesStore,
		initializeFeaturedPackages
	} from '$libs/stores';

	let featuredPackages: Package[] = [];

	let pkgFocus = 0;
	let width = 0;
	let styleFeaturedPackages: string;

	function resetFeaturedStyle() {
		const position = pkgFocus * width;
		styleFeaturedPackages = `
			width: ${featuredPackages.length * width}px;
			left: -${position}px;
			transition: left 0.6s ease-in;
		`;
	}

	function handleContainerResize(node: HTMLElement) {
		width = node.clientWidth;
		resetFeaturedStyle();
	}

	let loop: NodeJS.Timer;

	function resetLoop() {
		if (loop) clearInterval(loop);
		loop = setInterval(() => {
			pkgFocus++;
			if (pkgFocus === featuredPackages.length) {
				pkgFocus = 0;
			}
			resetFeaturedStyle();
		}, 3000);
		resetFeaturedStyle();
	}

	featuredPackagesStore.subscribe((v) => {
		featuredPackages = v;
	});

	onDestroy(() => clearInterval(loop));
	onMount(() => {
		if (!featuredPackages.length) {
			initializeFeaturedPackages();
		}
		resetLoop();
	});
</script>

<section class="h-96 w-full bg-black" use:watchResize={handleContainerResize}>
	<!-- <Placeholder label="FeaturedPackages" /> -->
	<header class="flex h-12 items-center justify-between bg-accent px-2">
		<p>FEATURED PACKAGES</p>
		<ul class="flex gap-2">
			{#each featuredPackages as pkg, i}
				<button
					on:click={() => {
						pkgFocus = i;
						resetLoop();
					}}
					class={`bg-purple h-4 w-4 rounded-lg border-2 border-white transition-colors ${
						i === pkgFocus ? 'bg-purple-900' : ''
					}`}
				/>
			{/each}
		</ul>
	</header>
	<figure class="absolute bottom-0 top-12 left-0 right-0 overflow-hidden">
		{#if featuredPackages.length}
			<section class="absolute top-0 flex h-full" style={styleFeaturedPackages}>
				{#each featuredPackages as pkg}
					<div class="h-full" style={`width:${width}px`}>
						<a href={`/packages/${pkg.slug}`}>
							<FeaturedPackage {pkg} {width} />
						</a>
					</div>
				{/each}
			</section>
		{:else}
			<Preloader />
		{/if}
	</figure>
</section>
