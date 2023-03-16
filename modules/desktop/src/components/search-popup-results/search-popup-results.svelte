<script lang="ts">
	import { searchStore } from '$libs/stores';
	import type { GUIPackage } from '$libs/types';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import Package from "$components/packages/package.svelte";
	import { PackageStates } from '$libs/types';
	// import Posts from '@tea/ui/posts/posts.svelte';

	import { installPackage } from '@native';
	import type { AirtablePost } from '@tea/ui/types';
	let term: string;
	let packages: GUIPackage[] = [];
	// let articles: AirtablePost[] = []; // news, blogs, etc
	// let workshops: AirtablePost[] = []; // workshops, course
	let loading = true;

	searchStore.subscribe((v) => {
		term = v;
	});
	searchStore.packagesSearch.subscribe((pkgs) => {
		packages = pkgs;
	});
	// searchStore.postsSearch.subscribe((posts) => {
	// 	let partialArticles: AirtablePost[] = [];
	// 	let partialWorkshops: AirtablePost[] = [];
	// 	for (let post of posts) {
	// 		if (post.tags.includes('news')) {
	// 			partialArticles.push(post);
	// 		}
	// 		if (post.tags.includes('course') || post.tags.includes('featured_course')) {
	// 			partialWorkshops.push(post);
	// 		}
	// 	}

	// 	articles = partialArticles;
	// 	workshops = partialWorkshops;
	// });

	searchStore.searching.subscribe((v) => (loading = v));

	const onClose = () => {
		term = '';
	};
</script>

<section class={term ? 'show' : ''}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<figure on:click={onClose} />
	<div class="border-gray z-20 border bg-black">
		<header class="flex justify-between p-4">
			<div class="text-primary text-2xl">Showing search results for `{term}`</div>

			<button on:click={onClose}>&#x2715</button>
		</header>
		<menu class="bg-accent flex h-8 w-full gap-4 px-4 text-xs">
			<button>packages ({packages.length})</button>
			<!-- <button>articles ({articles.length})</button>
			<button>workshops ({workshops.length})</button> -->
		</menu>
		<header class="text-primary p-4 text-lg">
			Top Package Results ({packages.length})
		</header>
		<ul class="grid grid-cols-3 gap-2">
			{#if packages.length > 0}
				{#each packages as pkg}
					<div class={pkg.state === PackageStates.INSTALLING ? 'animate-pulse' : ''}>
						<Package
							{pkg}
							onClick={async () => {
								try {
									pkg.state = PackageStates.INSTALLING;
									await installPackage(pkg);
									pkg.state = PackageStates.INSTALLED;
								} catch (error) {
									console.error(error);
								}
							}}
						/>
					</div>
				{/each}
			{:else if loading}
				{#each Array(12) as _}
					<section class="h-50 border-gray border p-4">
						<Preloader />
					</section>
				{/each}
			{/if}
		</ul>
		<!-- <header class="text-primary p-4 text-lg">
			Top Article Results ({articles.length})
		</header>
		{#if articles.length}
			<Posts posts={articles} linkTarget="_blank" />
		{:else if loading}
			<section class="border-gray h-64 border bg-black p-4">
				<Preloader />
			</section>
		{/if}
		<header class="text-primary p-4 text-lg">
			Top Workshop Results ({workshops.length})
		</header>
		{#if workshops.length}
			<Posts posts={workshops} linkTarget="_blank" />
		{:else if loading}
			<section class="border-gray h-64 border bg-black p-4">
				<Preloader />
			</section>
		{/if} -->
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 80px;
		left: 0px;
		right: 0;
		background: rgba(0, 0, 0, 0.7);
		transition: opacity 0.3s ease-in-out;
		opacity: 0%;
		overflow: hidden;
		height: 0px;
	}

	section.show {
		padding: 36px;
		z-index: 10;
	}

	section > figure {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
	section.show {
		opacity: 100%;
		height: 100%;
	}

	section > div {
		position: relative;
		height: 0%;
		transition: height 0.6s ease-in-out;
		overflow-y: scroll;
	}

	section.show > div {
		height: 90%;
	}
</style>
