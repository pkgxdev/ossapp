<script lang="ts">
	import { page } from '$app/stores';
	import { beforeUpdate } from 'svelte';
	import { searchStore } from '$libs/stores';
	import SearchInput from '@tea/ui/search-input/search-input.svelte';
	import { navStore } from '$libs/stores';
	import { t } from '$libs/translations';

	import ProfileNavButton from './profile-nav-button.svelte';

	let { nextPath, prevPath } = navStore;

	let currentPath: string;
	beforeUpdate(async () => {
		currentPath = $page.url.pathname;
	});
</script>

<header class="border-gray flex items-center justify-between border w-full h-12 pr-2 border-t-0 border-x-0" style="-webkit-app-region: drag">
	<ul class="text-gray flex h-10 gap-2 align-middle leading-10 pl-20">
		<a href="/?tab=all">
			<div class="home-btn transition-all text-xl w-12 rounded-md text-center"><i class="icon-tea-logo-iconasset-1"/></div>
		</a>
		<button on:click={navStore.back} class:active={$prevPath} class="opacity-50 pt-1 text-xs"><i class="icon-arrow-left"/></button>
		<button on:click={navStore.next} class:active={$nextPath} class="opacity-50 pt-1 text-xs"><i class="icon-arrow-right"/></button>
	</ul>
	<div class="px-2 w-1/3 relative">
		<SearchInput
			class="w-full border border-gray rounded-sm h-9"
			size="small"
			placeholder="{$t("store-search-placeholder")}"
			onFocus={() => {
				searchStore.searching.set(true);
			}}
		/>
		<kbd class="absolute top-0 right-3 opacity-50 bg-gray text-white px-2 mt-1 rounded-sm flex items-center" style="letter-spacing: 0.5pt">
			<span class="text-lg">⌘</span>
			<span class="text-xs" style="font-size: smaller">K</span>
		</kbd>
	</div>
	<ProfileNavButton />
</header>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	header {
		background: rgba(26,26,26,0.9);
		backdrop-filter: blur(2px);
		box-sizing: border-box;
	}
	.home-btn {
		height: 40px;
		width: 40px;
		line-height: 40px;
		padding-left: 3px;
		background-color: rgba(34, 34, 34, 1);
	}
	.home-btn:hover {
		background-size: cover;
		background-position: center center;
		background-image: url("/images/gradient-bg.png");
		color: #222222;
	}
	ul button {
		pointer-events: none;
	}

	ul button.active {
		color: white;
		pointer-events: all;
		opacity: 1;
	}
</style>
