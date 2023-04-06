<script lang="ts">
	import { searchStore } from '$libs/stores';
	import type { GUIPackage } from '$libs/types';
	import SearchInput from '@tea/ui/search-input/search-input.svelte';
	import { t } from '$libs/translations';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import Package from "$components/packages/package.svelte";
	import { PackageStates } from '$libs/types';
	import PackageResult from "./package-search-result.svelte";
	import Mousetrap from 'mousetrap';
	// import Posts from '@tea/ui/posts/posts.svelte';

	import { installPackage } from '@native';
  import { onMount } from 'svelte';

	const { searching, packagesSearch } = searchStore;
	// import type { AirtablePost } from '@tea/ui/types';
	let term: string;
	// let articles: AirtablePost[] = []; // news, blogs, etc
	// let workshops: AirtablePost[] = []; // workshops, course
	let loading = true;

	// searchStore.packagesSearch.subscribe((pkgs) => {
	// 	packages = pkgs;
	// });
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
		searchStore.searching.set(false);
	};
</script>
{#if $searching}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="bg-close" class="z-40" on:click={onClose}></div>
	<section class="z-50">
		<header class="flex border border-gray border-t-0 border-x-0 bg-black">
			<div class="relative w-full">
				<SearchInput
					class="w-full  rounded-sm h-9"
					size="small"
					placeholder={`${$t("store-search-placeholder")}`}
					onSearch={(search) => {
						term = search;
						searchStore.search(search);
					}}
				/>
				<div class="absolute top-2 right-3 opacity-50 flex items-center gap-1">
					<button class="text-xs mt-1">clear</button>
					<kbd class=" bg-gray text-white px-2 mt-1 rounded-sm flex items-center">
						<span class="text-xs">ctrl + shift + del</span>
					</kbd>
				</div>
			</div>
			<button class="mr-2" on:click={onClose}>&#x2715</button>
		</header>
		{#if term}
			<div class="z-20 bg-black">
				<header class="text-gray p-4 text-lg">
					Packages ({$packagesSearch.length})
				</header>
				<ul class="flex flex-col gap-2 p-2">
					{#if $packagesSearch.length > 0}
						{#each $packagesSearch as pkg}
							<div class={pkg.state === PackageStates.INSTALLING ? 'animate-pulse' : ''}>
								<PackageResult
									{pkg}
									{onClose}
									onClick={async () => {
										try {
											pkg.state = PackageStates.INSTALLING;
											await installPackage(pkg, pkg.version);
											pkg.state = PackageStates.INSTALLED;
										} catch (error) {
											console.error(error);
										}
									}}
								/>
							</div>
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
		{:else}
			<div class="w-full h-full flex flex-col justify-center bg-black">
				<p class="text-gray text-center">start typing to search</p>
			</div>
		{/if}
	</section>
{/if}

<style>
	#bg-close {
		position: fixed;
		width: calc(100vw - 2px);
		height: calc(100vh - 2px);
		top: 1px;
		left: 1px;
		background: rgba(0, 0, 0, 0.7);
		border-radius: 12px;
	}
	section {
		position: fixed;
		top: 50px;
		left: 50px;
		right: 50px;
		bottom: 50px;
		background: rgba(0, 0, 0, 0.7);
		transition: opacity 0.3s ease-in-out;
		opacity: 1;
		overflow: hidden;
		height: auto;
		border: gray 1px solid;
		border-radius: 12px;
	}

	section > div {
		position: relative;
		margin-top: 2px;
		height: calc(100% - 40px);
		width: 100%;
		transition: height 0.6s ease-in-out;
		overflow-y: scroll;
	}


	/* width */
	::-webkit-scrollbar {
		width: 6px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #272626;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #949494;
		border-radius: 4px;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: white;
	}
</style>
