<script lang="ts">
	import '$appcss';

	import { page } from '$app/stores';
	import { t } from '$libs/translations';
	import { afterNavigate } from '$app/navigation';
	import { packagesStore, notificationStore } from '$libs/stores';
	import Packages from '$components/packages/packages.svelte';
	import { PackageStates, SideMenuOptions, type GUIPackage } from '$libs/types';
	// import SortingButtons from "$components/search-packages/sorting-buttons.svelte";
	import SideMenu from "$components/side-menu/side-menu.svelte";
	import NotificationBar from '$components/notification-bar/notification-bar.svelte';
	import WelcomeModal from '$components/welcome-modal/welcome-modal.svelte';
	import Button from "@tea/ui/button/button.svelte";


	const log = window.require("electron-log");

	const { packages, requireTeaCli } = packagesStore;

	const url = $page.url;

	let sideMenuOption = url.searchParams.get("tab") as SideMenuOptions || SideMenuOptions.all;

	let sortBy: "popularity" | "most recent" = "popularity";
	let sortDirection: "asc" | "desc" = "desc";

	let updating = false;

	let packagesScrollY = 0;

	$: pkgsToUpdate = $packages.filter((p: GUIPackage) => p.state === PackageStates.NEEDS_UPDATE);
	async function updateAll() {
		updating = true;
		log.info(`updating: ${pkgsToUpdate.length} packages`);
		for(const pkg of pkgsToUpdate) {
			try {
				await packagesStore.installPkg(pkg);
				notificationStore.add({
					message: `Package ${pkg.full_name} has been updated to  v${pkg.version}.`,
				});
			} catch (error) {
				log.error(error);
			}
		}
		updating = false;
		sideMenuOption = SideMenuOptions.all;
	}

	$: teaPkg = $packages.find((p) => p.full_name === "tea.xyz");
	$: needsUpdateCount = pkgsToUpdate.length;

	
	afterNavigate(({ from, to }) => {
		if (to?.url?.pathname === "/") {
			const tab = to.url.searchParams.get("tab")
			sideMenuOption = !tab ? SideMenuOptions.all : tab as SideMenuOptions;
		}
	});
</script>

<div id="package-container">
	<Packages packageFilter={sideMenuOption} {sortBy} {sortDirection} bind:scrollY={packagesScrollY}/>
</div>
<header class="transition-all px-2 flex flex-col" class:scrolling={packagesScrollY > 100}>
	<NotificationBar />
	<div class="flex justify-between items-center">
		<h1 class="text-primary pl-3 pt-2 text-2xl font-bold font-mona">{$t(`side-menu-title.${sideMenuOption}`)}</h1>
		<!-- 
		<section class="border-gray mt-4 mr-4 h-10 w-48 border rounded-sm">
			
			we might bring it back?
			<SortingButtons onSort={(prop, dir) => {
				sortBy = prop;
				sortDirection = dir;
			}} />
		</section>
		 -->
		{#if needsUpdateCount}
			<Button
				class={`w-48 h-8 text-xs ${updating && "animate-pulse"}`}
				type="plain"
				color="secondary"
				onClick={updateAll}
			>
					{$t(`package.update-all`)} [{needsUpdateCount}]
			</Button> 
		{/if}
	</div>
</header>
<SideMenu bind:activeOption={sideMenuOption}/>
{#if $requireTeaCli }
	<WelcomeModal tea={teaPkg} />
{/if}
<style>
	#package-container {
		width: calc(100% - 200px);
		margin-left: 200px;
	}

	header {
		position: absolute;
		top: 0px;
		left: 190px;
		height: 72px;
		width: calc(100% - 190px - 10px);
		background-image: linear-gradient(rgba(26,26,26,1), rgba(26,26,26,0));
		padding-top: 15px;
	}

	header.scrolling {
		height: 60px;
		background-color: #222222;
		padding-top: 5px;
	}
</style>
