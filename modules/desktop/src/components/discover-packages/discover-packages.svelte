<script lang="ts">
	import "$appcss";
	import { watchResize } from "svelte-watch-resize";
	// import { t } from '$libs/translations';
	import type { GUIPackage } from "$libs/types";
	import moment from "moment";
	import { PackageStates, SideMenuOptions } from "$libs/types";
	import Preloader from "@tea/ui/Preloader/Preloader.svelte";
	import Package from "$components/packages/package.svelte";
	import { packagesStore } from "$libs/stores";

	const { packageList: allPackages } = packagesStore;
	export let packageFilter: SideMenuOptions = SideMenuOptions.discover;

	export let sortBy: "popularity" | "most recent" = "most recent";
	export let sortDirection: "asc" | "desc" = "desc";

	export let scrollY = 0;

	let loadMore = 9;
	let limit = loadMore + 9;

	const onScroll = (e: Event) => {
		const target = e.target as HTMLInputElement;
		scrollY = target.scrollTop || 0;
	};

	$: packages = $allPackages.filter((p) => p.categories.includes(SideMenuOptions.discover)).sort((a, b) => {
    const aPop = +a.dl_count + a.installs;
    const bPop = +b.dl_count + b.installs;
    return bPop - aPop;
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

<div class="relative h-full w-full">
	<ul class="flex flex-wrap content-start bg-black" use:watchResize={onResize} on:scroll={onScroll}>
		{#if packages.slice(1).length > 0}
      <div class="z-1 p-1 w-full">
        <Package tab={packageFilter} pkg={packages[0]} orientation="left" />
      </div>
			{#each packages.slice(1) as pkg, index}
				{#if index < limit}
					<div class="card z-1 p-1">
						<Package tab={packageFilter} {pkg} />
					</div>
				{/if}
			{/each}
		{:else}
			{#each Array(9) as _}
				<section class="card p-1 h-{238}">
					<div class="border-gray h-full w-full border">
						<Preloader />
					</div>
				</section>
			{/each}
		{/if}
	</ul>
</div>

<style>
	ul {
		margin-top: 0px;
		padding-top: 80px;
		height: calc(100vh - 49px);
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

	.card {
		width: 100%;
	}

	@media screen and (min-width: 650px) {
		.card {
			width: 50%;
		}
	}
</style>
