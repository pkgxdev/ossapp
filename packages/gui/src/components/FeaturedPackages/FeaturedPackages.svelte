<script lang="ts">
	import '$appcss';
	import { onDestroy, onMount } from 'svelte';
	import { watchResize } from 'svelte-watch-resize';
	import type { Package } from '@tea/ui/types';
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

<section class="bg-black w-full h-96" use:watchResize={handleContainerResize}>
	<!-- <Placeholder label="FeaturedPackages" /> -->
	<header class="bg-accent h-12 flex justify-between px-2 items-center">
		<p>FEATURED PACKAGES</p>
		<ul class="flex gap-2">
			{#each featuredPackages as pkg, i}
				<button
					on:click={() => {
						pkgFocus = i;
						resetLoop();
					}}
					class={`border-white border-2 w-4 h-4 rounded-lg bg-purple transition-colors ${
						i === pkgFocus ? 'bg-purple-900' : ''
					}`}
				/>
			{/each}
		</ul>
	</header>
	<figure class="overflow-hidden absolute bottom-0 top-12 left-0 right-0">
		<section class="flex absolute top-0 h-full" style={styleFeaturedPackages}>
			{#each featuredPackages as pkg}
				<div class="h-full" style={`width:${width}px`}>
					<a href={`/packages/${pkg.slug}`}>
						<FeaturedPackage {pkg} />
					</a>
				</div>
			{/each}
		</section>
	</figure>
</section>
