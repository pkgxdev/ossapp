<script lang="ts">
	import "../app.css";
	import { onDestroy, onMount } from "svelte";
	import { watchResize } from "svelte-watch-resize";
	import Preloader from "../Preloader/Preloader.svelte";
	import GalleryItem from "./gallery-item.svelte";

	export let title = "";
	export let linkTarget = "";

	interface GalleryItemShape {
		imageUrl: string;
		title: string;
		subTitle: string;
		link: string;
	}

	export let items: GalleryItemShape[] = [];

	let focus = 0;
	let width = 0;
	let styleFeaturedPackages: string;

	function resetFeaturedStyle() {
		const position = focus * width;
		styleFeaturedPackages = `
			width: ${items.length * width}px;
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
			focus++;
			if (focus === items.length) {
				focus = 0;
			}
			resetFeaturedStyle();
		}, 3000);
		resetFeaturedStyle();
	}

	onDestroy(() => clearInterval(loop));
	onMount(() => {
		resetLoop();
	});
</script>

<section class="h-96 w-full bg-black" use:watchResize={handleContainerResize}>
	<!-- <Placeholder label="FeaturedPackages" /> -->
	<header class="flex h-12 items-center justify-between bg-accent px-2">
		<p>{title}</p>
		<ul class="flex gap-2">
			{#each items as _item, i}
				<button
					on:click={() => {
						focus = i;
						resetLoop();
					}}
					class={`bg-purple h-3 w-3 rounded-lg border border-white transition-colors ${
						i === focus ? "bg-purple-900" : ""
					}`}
				/>
			{/each}
		</ul>
	</header>
	<figure class="absolute bottom-0 top-12 left-0 right-0 overflow-hidden">
		{#if items.length}
			<section class="absolute top-0 flex h-full" style={styleFeaturedPackages}>
				{#each items as item}
					<div class="h-full" style={`width:${width}px`}>
						<a href={item.link} target={linkTarget} rel="noopener">
							<GalleryItem {...item} {width} />
						</a>
					</div>
				{/each}
			</section>
		{:else}
			<Preloader />
		{/if}
	</figure>
</section>
