<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations';
	import { navStore, packagesStore, notificationStore } from '$libs/stores';
	import Packages from '$components/packages/packages.svelte';
	import { SideMenuOptions } from '$libs/types';
	import SortingButtons from "$components/search-packages/sorting-buttons.svelte";
	import SideMenu from "$components/side-menu/side-menu.svelte";

	const { sideNavOpen } = navStore; // right side not left

	let sideMenuOption = SideMenuOptions.all;

	let sortBy: "popularity" | "most recent" = "popularity";
	let sortDirection: "asc" | "desc" = "desc";
</script>

<div id="package-container">
	<Packages packageFilter={sideMenuOption} {sortBy} {sortDirection}/>
</div>
<SideMenu bind:activeOption={sideMenuOption}/>
<header class={`transition-all px-2 flex justify-between items-center align-middle ${$sideNavOpen ? "min": ""} ${$notificationStore.length ? "lower": ""}`}>
	<h1 class="text-primary mt-4 text-2xl font-bold">{$t(`side-menu-title.${sideMenuOption}`)}</h1>
	<section class="border-gray mt-4 mr-4 h-10 w-48 border rounded-sm">
		<SortingButtons onSort={(prop, dir) => {
			sortBy = prop;
			sortDirection = dir;
		}} />
	</section>
</header>

<style>
	#package-container {
		padding-top: 36px;
		width: calc(100% - 200px);
		margin-left: 200px;
	}

	header {
		position: fixed;
		top: 40px;
		left: 190px;
		height: 50px;
		width: calc(100% - 190px);
		background-image: linear-gradient(black, rgba(0,0,0,0.6), rgba(0,0,0,0));
	}

	header.lower {
		top: 80px;
	}

	header.min {
		width: calc(75% - 190px);
	}
</style>
