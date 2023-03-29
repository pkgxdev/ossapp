<script lang="ts">
	import '$appcss';
	// import { t } from '$libs/translations';
	import type { GUIPackage } from '$libs/types';
	import moment from "moment";
	import { PackageStates, SideMenuOptions } from '$libs/types';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import Package from "./package.svelte";
	import { packagesStore } from '$libs/stores';

	const { packages: allPackages } = packagesStore;
	export let packageFilter: SideMenuOptions = SideMenuOptions.all;

	export let sortBy: "popularity" | "most recent" = 'popularity';
	export let sortDirection: 'asc' | 'desc' = 'desc';

	const loadMore = 9;
	let limit = loadMore;

	// TODO: figure out a better type strategy here so that this breaks if SideMenuOptions is updated
	const pkgFilters: { [key:string]: (pkg: GUIPackage) => boolean } = {
		[SideMenuOptions.all]: (_pkg: GUIPackage) => true,
		[SideMenuOptions.installed]: (pkg: GUIPackage) => pkg.state === PackageStates.INSTALLED,
		[SideMenuOptions.installed_updates_available]: (pkg: GUIPackage) => pkg.state === PackageStates.NEEDS_UPDATE,
		[SideMenuOptions.recently_updated]: (pkg: GUIPackage) => {
			return moment(pkg.last_modified).isAfter(moment().subtract(30, "days"));
		},
		[SideMenuOptions.new_packages]: (pkg: GUIPackage) => {
			return moment(pkg.created).isAfter(moment().subtract(30, "days"));
		},
		[SideMenuOptions.popular]: (pkg: GUIPackage) => pkg.categories.includes(SideMenuOptions.popular),
		[SideMenuOptions.featured]: (pkg: GUIPackage) => pkg.categories.includes(SideMenuOptions.featured),
		[SideMenuOptions.essentials]: (pkg: GUIPackage) => pkg.categories.includes(SideMenuOptions.essentials),
		[SideMenuOptions.star_struct]: (pkg: GUIPackage) => pkg.categories.includes(SideMenuOptions.star_struct),
		[SideMenuOptions.made_by_tea]: (pkg: GUIPackage) => pkg.full_name.includes("tea.xyz"),
	}

	$: packages = $allPackages
		.filter(pkgFilters[packageFilter] || pkgFilters.all)
		.sort((a, b) => {
			if (sortBy === "popularity") {
				const aPop = +a.dl_count + a.installs;
				const bPop = +b.dl_count + b.installs;
				return sortDirection === "asc" ? aPop - bPop : bPop - aPop;
			} else {
				// most recent
				const aDate = new Date(a.last_modified);
				const bDate = new Date(b.last_modified);
				return sortDirection === "asc" ? +aDate - +bDate : +bDate - +aDate;
			}
		});
</script>

<div>
	<ul class="grid grid-cols-3 gap-2 bg-black">
		{#if packages.length > 0}
			{#each packages as pkg, index}
				{#if index < limit}
					<div class={pkg.state === PackageStates.INSTALLING ? 'animate-pulse' : ''}>
						<Package
							tab={packageFilter}
							{pkg}
							onClick={(version) => packagesStore.installPkg(pkg, version)}
						/>
					</div>
				{/if}
			{/each}
		{:else}
			{#each Array(9) as _}
				<section class="h-50 border-gray border p-4">
					<Preloader />
				</section>
			{/each}
		{/if}
	</ul>
	{#if limit < packages.length }
	<footer class="w-full flex border border-gray h-16">
		<button class="flex-grow h-16" on:click={() => limit += loadMore }>show more</button>
	</footer>
	{/if}
</div>

<style>
	button {
		height: 100%;
		text-decoration: none;
		min-width: 120px;
		transition: 0.1s linear;
	}

	button:hover, button.active {
		color: white;
		background-color: #8000ff;
		box-shadow: inset 0vw 0vw 0vw 0.223vw #1a1a1a !important;
		box-sizing: border-box;
	}
</style>
