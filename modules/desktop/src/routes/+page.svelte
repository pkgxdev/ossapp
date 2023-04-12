<script lang="ts">
	import '$appcss';

	import { page } from '$app/stores';
	import { t } from '$libs/translations';
	import { afterNavigate } from '$app/navigation';
	import { packagesStore } from '$libs/stores';
	import Packages from '$components/packages/packages.svelte';
	import { PackageStates, SideMenuOptions, type GUIPackage } from '$libs/types';
	// import SortingButtons from "$components/search-packages/sorting-buttons.svelte";
	import SideMenu from "$components/side-menu/side-menu.svelte";
	import NotificationBar from '$components/notification-bar/notification-bar.svelte';
	import WelcomeModal from '$components/welcome-modal/welcome-modal.svelte';
	import Button from "@tea/ui/button/button.svelte";


	const log = window.require("electron-log");

	const { packageList, requireTeaCli } = packagesStore;

	const url = $page.url;

	let sideMenuOption = url.searchParams.get("tab") as SideMenuOptions || SideMenuOptions.all;

	let sortBy: "popularity" | "most recent" = "most recent";
	let sortDirection: "asc" | "desc" = "desc";

	let updating = false;

	let packagesScrollY = 0;
	$: currentUpdatingPkg = $packageList.find((p) => p.state === PackageStates.UPDATING)
	$: updatingMessage = `updating ${currentUpdatingPkg?.full_name} (${currentUpdatingPkg?.install_progress_percentage}%)`;

	$: pkgsToUpdate = $packageList.filter((p: GUIPackage) => p.state === PackageStates.NEEDS_UPDATE);
	async function updateAll() {
		updating = true;
		log.info(`updating: ${pkgsToUpdate.length} packages`);
		for(const pkg of pkgsToUpdate) {
			try {
				await packagesStore.installPkg(pkg);
			} catch (error) {
				log.error(error);
			}
		}
		updating = false;
		sideMenuOption = SideMenuOptions.all;
	}

	$: teaPkg = $packageList.find((p) => p.full_name === "tea.xyz");
	$: needsUpdateCount = pkgsToUpdate.length;

	
	afterNavigate(({ from, to }) => {
		if (to?.url?.pathname === "/") {
			const tab = to.url.searchParams.get("tab")
			sideMenuOption = !tab ? SideMenuOptions.all : tab as SideMenuOptions;
		}
	});
</script>

<div id="content" class="flex flex-col">
	<NotificationBar />
	<article class="w-full h-auto flex-grow overflow-hidden relative">
		<ul class="px-2">
			<Packages packageFilter={sideMenuOption} {sortBy} {sortDirection} bind:scrollY={packagesScrollY}/>
		</ul>
		<header class="flex justify-between items-center z-30" class:scrolling={packagesScrollY > 150}>
			<h1 class="text-primary pl-3 text-2xl font-bold font-mona">
				{$t(`side-menu-title.${sideMenuOption}`)}
			</h1>
			<!-- 
			<section class="border-gray mt-4 mr-4 h-10 w-48 border rounded-sm">
				
				we might bring it back?
				<SortingButtons onSort={(prop, dir) => {
					sortBy = prop;
					sortDirection = dir;
				}} />
			</section>
			 -->
			{#if needsUpdateCount && sideMenuOption === SideMenuOptions.installed_updates_available}
			 <div class="flex items-center text-sm pr-2">
				{#if currentUpdatingPkg}
					<p class="text-gray px-2">{updatingMessage}</p>
				{/if}
				<Button
					class="w-48 h-8 text-xs"
					loading={updating}
					type="plain"
					color="secondary"
					onClick={updateAll}
				>
						{$t(`package.update-all`)} [{needsUpdateCount}]
				</Button> 
			 </div>
			{/if}
		</header>
	</article>
</div>

<SideMenu bind:activeOption={sideMenuOption}/>
{#if $requireTeaCli && teaPkg }
	<WelcomeModal tea={teaPkg} />
{/if}
<style>
	#content {
		width: calc(100vw - 191px);
		margin-left: 185px;
		height: calc(100vh - 48px - 27px);
		overflow: hidden;
	}

	header {
		position: absolute;
		top: 0px;
		left: 1px;
		height: 72px;
		width: 100%;
		background-image: linear-gradient(rgba(26,26,26,1), rgba(26,26,26,0));
		padding-top: 15px;
	}

	header h1 {
		padding-top: 8px;
	}

	header.scrolling {
		height: 60px;
		background-color: #222222;
		padding-top: 5px;
	}

	header.scrolling h1 {
		padding-top: 0px;
	}
</style>
