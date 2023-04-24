<script lang="ts">
	import { page } from "$app/stores";
	import { beforeUpdate } from "svelte";
	import { searchStore } from "$libs/stores";
	import SearchInput from "@tea/ui/search-input/search-input.svelte";
	import { navStore } from "$libs/stores";
	import { t } from "$libs/translations";

	import TopBarMenu from "./top-bar-menu.svelte";
	import { topbarDoubleClick } from "$libs/native-electron";

	let { nextPath, prevPath } = navStore;

	let currentPath: string;
	beforeUpdate(async () => {
		currentPath = $page.url.pathname;
	});
</script>

<header
	class="border-gray relative z-20 flex h-12 w-full items-center justify-between border border-x-0 border-t-0 pr-2"
	style="-webkit-app-region: drag"
	on:dblclick={topbarDoubleClick}
>
	<ul class="text-gray flex h-10 gap-1 pl-20 align-middle items-center leading-10">
		<a href="/?tab=all">
			<div class="home-btn w-12 rounded-md text-center text-xl transition-all">
				<i class="icon-tea-logo-iconasset-1" />
			</div>
		</a>
		<button on:click={navStore.back} class:active={$prevPath} class="pt-1 px-2 h-[28px] text-xs rounded-sm transition-all opacity-50 hover:bg-gray hover:text-black"
			><i class="icon-arrow-left" /></button
		>
		<button on:click={navStore.next} class:active={$nextPath} class="pt-1 px-2 h-[28px] text-xs rounded-sm transition-all opacity-50 hover:bg-gray hover:text-black"
			><i class="icon-arrow-right" /></button
		>
	</ul>
	<div class="relative w-1/3 px-2">
		<SearchInput
			class="border-gray h-9 w-full rounded-sm border"
			size="small"
			placeholder={$t("store-search-placeholder")}
			onFocus={() => {
				searchStore.searching.set(true);
			}}
		/>

		<kbd
			class="bg-gray pointer-events-none absolute top-0 right-3 mt-1 flex items-center rounded-sm px-2 text-white opacity-50"
			style="letter-spacing: 0.5pt"
		>
			<span class="text-lg">⌘</span>
			<span class="text-xs" style="font-size: smaller">K</span>
		</kbd>
	</div>
	<TopBarMenu />
</header>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	header {
		background: rgba(26, 26, 26, 0.9);
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
