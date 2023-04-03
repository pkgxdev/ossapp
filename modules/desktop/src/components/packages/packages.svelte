<script lang="ts">
	import "$appcss";
	import { watchResize } from "svelte-watch-resize";
	import InfiniteScroll from "svelte-infinite-scroll";
	// import { t } from '$libs/translations';
	import type { GUIPackage } from "$libs/types";
	import moment from "moment";
	import { PackageStates, SideMenuOptions } from "$libs/types";
	import Preloader from "@tea/ui/Preloader/Preloader.svelte";
	import Package from "./package.svelte";
	import { packagesStore } from "$libs/stores";

	const { packages: allPackages } = packagesStore;
	export let packageFilter: SideMenuOptions = SideMenuOptions.all;

	export let sortBy: "popularity" | "most recent" = "popularity";
	export let sortDirection: "asc" | "desc" = "desc";

	export let scrollY = 0;

	let loadMore = 9;
	let limit = loadMore;

	// TODO: figure out a better type strategy here so that this breaks if SideMenuOptions is updated
	const pkgFilters: { [key: string]: (pkg: GUIPackage) => boolean } = {
		[SideMenuOptions.all]: (_pkg: GUIPackage) => true,
		[SideMenuOptions.installed]: (pkg: GUIPackage) => {
			return [
				PackageStates.INSTALLED,
				PackageStates.INSTALLING,
				PackageStates.NEEDS_UPDATE,
				PackageStates.UPDATING
			].includes(pkg.state);
		},
		[SideMenuOptions.installed_updates_available]: (pkg: GUIPackage) => {
			return [PackageStates.UPDATING, PackageStates.NEEDS_UPDATE].includes(pkg.state);
		},
		[SideMenuOptions.recently_updated]: (pkg: GUIPackage) => {
			return moment(pkg.last_modified).isAfter(moment().subtract(30, "days"));
		},
		[SideMenuOptions.new_packages]: (pkg: GUIPackage) => {
			return moment(pkg.created).isAfter(moment().subtract(30, "days"));
		},
		[SideMenuOptions.popular]: (pkg: GUIPackage) =>
			pkg.categories.includes(SideMenuOptions.popular),
		[SideMenuOptions.featured]: (pkg: GUIPackage) =>
			pkg.categories.includes(SideMenuOptions.featured),
		[SideMenuOptions.essentials]: (pkg: GUIPackage) =>
			pkg.categories.includes(SideMenuOptions.essentials),
		[SideMenuOptions.star_struct]: (pkg: GUIPackage) =>
			pkg.categories.includes(SideMenuOptions.star_struct),
		[SideMenuOptions.made_by_tea]: (pkg: GUIPackage) => pkg.full_name.includes("tea.xyz")
	};

	const onScroll = (e: Event) => {
		const target = e.target as HTMLInputElement;
		scrollY = target.scrollTop || 0;
	};

	$: packages = $allPackages.filter(pkgFilters[packageFilter] || pkgFilters.all).sort((a, b) => {
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

	const onResize = (node: HTMLElement) => {
		const assumedCardHeight = 250;
		const cardRows = Math.floor(packages.length / 3);
		const minCardRows = Math.floor(node.scrollHeight / assumedCardHeight);
		if (cardRows < minCardRows) {
			const addLimit = 3 * (minCardRows - cardRows);
			limit += addLimit;
		}
	};
</script>

<div>
	<ul class="flex flex-wrap bg-black" use:watchResize={onResize} on:scroll={onScroll}>
		{#if packages.length > 0}
			{#each packages as pkg, index}
				{#if index < limit}
					<div class="w-1/3 p-1" class:animate-puls={pkg.state === PackageStates.INSTALLING}>
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
		<InfiniteScroll threshold={100} on:loadMore={() => (limit += loadMore)} />
	</ul>
</div>

<style>
	ul {
		margin-top: 0px;
		padding-top: 80px;
		height: calc(100vh - 76px);
		overflow-y: scroll;
		overflow-x: hidden;
		padding-right: 4px;
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
