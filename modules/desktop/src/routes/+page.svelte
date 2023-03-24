<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations';
	import { navStore, packagesStore } from '$libs/stores';
	import Packages from '$components/packages/packages.svelte';
	import { PackageStates, SideMenuOptions } from '$libs/types';
	import SortingButtons from "$components/search-packages/sorting-buttons.svelte";
	import SideMenu from "$components/side-menu/side-menu.svelte";
	import NotificationBar from '$components/notification-bar/notification-bar.svelte';
	import WelcomeModal from '$components/welcome-modal/welcome-modal.svelte';

	const { sideNavOpen } = navStore; // right side not left
	const { packages } = packagesStore;

	let sideMenuOption = SideMenuOptions.all;

	let sortBy: "popularity" | "most recent" = "popularity";
	let sortDirection: "asc" | "desc" = "desc";

	$: teaPkg = $packages.find((p) => p.full_name === "tea.xyz");
</script>

<div id="package-container">
	<Packages packageFilter={sideMenuOption} {sortBy} {sortDirection}/>
</div>
<SideMenu bind:activeOption={sideMenuOption}/>
<header class={`transition-all px-2 flex flex-col ${$sideNavOpen ? "min": ""}`}>
	<NotificationBar />
	<div class="flex justify-between items-center align-middle">
		<h1 class="text-primary mt-4 pl-3 text-2xl font-bold font-mona">{$t(`side-menu-title.${sideMenuOption}`)}</h1>
		<section class="border-gray mt-4 mr-4 h-10 w-48 border rounded-sm">
			<SortingButtons onSort={(prop, dir) => {
				sortBy = prop;
				sortDirection = dir;
			}} />
		</section>
	</div>
</header>

{#if !teaPkg || PackageStates.AVAILABLE === teaPkg?.state || !teaPkg?.installed_versions?.length }
	<WelcomeModal tea={teaPkg} />
{/if}
<style>
	#package-container {
		padding-top: 50px;
		width: calc(100% - 200px);
		margin-left: 200px;
	}

	header {
		position: fixed;
		top: 48px;
		left: 190px;
		height: 150px;
		width: calc(100% - 190px);
		background-image: linear-gradient(rgba(26,26,26,1), rgba(26,26,26,0));
		padding-bottom: 80px;
	}

	header.lower {
		top: 80px;
	}

	header.min {
		width: calc(75% - 190px);
	}
</style>
