<script lang="ts">
	import { searchStore } from '$libs/stores';
	import type { GUIPackage } from '$libs/types';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import PackageCard from '@tea/ui/PackageCard/PackageCard.svelte';
	import { PackageStates } from '$libs/types';
	import Posts from '@tea/ui/Posts/Posts.svelte';

	import { installPackage } from '@api';
	import type { AirtablePost } from '@tea/ui/types';
	let term: string;
	let packagesFound: GUIPackage[] = [];

	let articles: AirtablePost[] = []; // news, blogs, etc
	let workshops: AirtablePost[] = []; // workshops, course

	searchStore.subscribe((v) => {
		term = v;
	});
	searchStore.packagesSearch.subscribe((pkgs) => {
		packagesFound = pkgs;
	});
	searchStore.postsSearch.subscribe((posts) => {
		let partialArticles: AirtablePost[] = [];
		let partialWorkshops: AirtablePost[] = [];
		for (let post of posts) {
			if (post.tags.includes('news')) {
				partialArticles.push(post);
			}
			if (post.tags.includes('course') || post.tags.includes('featured_course')) {
				partialWorkshops.push(post);
			}
		}

		articles = partialArticles;
		workshops = partialWorkshops;
	});

	const getCTALabel = (state: PackageStates): string => {
		return {
			[PackageStates.AVAILABLE]: 'INSTALL',
			[PackageStates.INSTALLED]: 'INSTALLED',
			[PackageStates.INSTALLING]: 'INSTALLING',
			[PackageStates.UNINSTALLED]: 'RE-INSTALL'
		}[state];
	};
</script>

<section class={term ? 'show' : ''}>
	<div class="border border-gray bg-black">
		<header class="p-4 text-2xl text-primary">
			Showing search results for `{term}`
		</header>
		<menu class="flex h-8 w-full gap-4 bg-accent px-4 text-xs">
			<button>packages ({packagesFound.length})</button>
			<button>articles ({articles.length})</button>
			<button>workshops ({workshops.length})</button>
		</menu>
		<header class="p-4 text-lg text-primary">
			Top Package Results ({packagesFound.length})
		</header>
		<ul class="grid grid-cols-3">
			{#if packagesFound.length > 0}
				{#each packagesFound as pkg}
					<div class={pkg.state === PackageStates.INSTALLING ? 'animate-pulse' : ''}>
						<PackageCard
							{pkg}
							link={`/packages/${pkg.slug}`}
							ctaLabel={getCTALabel(pkg.state)}
							onClickCTA={async () => {
								try {
									pkg.state = PackageStates.INSTALLING;
									await installPackage(pkg.full_name);
									pkg.state = PackageStates.INSTALLED;
								} catch (error) {
									console.error(error);
								}
							}}
						/>
					</div>
				{/each}
			{:else}
				{#each Array(12) as _}
					<section class="h-50 border border-gray p-4">
						<Preloader />
					</section>
				{/each}
			{/if}
		</ul>
		<header class="p-4 text-lg text-primary">
			Top Article Results ({articles.length})
		</header>
		{#if articles.length}
			<Posts posts={articles} linkTarget="_blank" />
		{:else}
			<section class="h-64 border border-gray bg-black p-4">
				<Preloader />
			</section>
		{/if}
		<header class="p-4 text-lg text-primary">
			Top Workshop Results ({workshops.length})
		</header>
		{#if workshops.length}
			<Posts posts={workshops} linkTarget="_blank" />
		{:else}
			<section class="h-64 border border-gray bg-black p-4">
				<Preloader />
			</section>
		{/if}
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 240px;
		right: 0;
		background: rgba(0, 0, 0, 0.7);
		transition: opacity 0.3s ease-in-out;
		padding: 36px;
		opacity: 0%;
		overflow: hidden;
		height: 0px;
	}

	section.show {
		opacity: 100%;
		height: 100%;
	}

	section > div {
		height: 0%;
		transition: height 0.6s ease-in-out;
		overflow-y: scroll;
	}

	section.show > div {
		height: 90%;
	}
</style>
