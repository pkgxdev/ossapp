<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations';
	import type { GUIPackage } from '$libs/types';
	import { PackageStates } from '$libs/types';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import Package from "./package.svelte";
	import { packagesStore } from '$libs/stores';

	import { installPackage } from '@native';
	import { trackInstall, trackInstallFailed } from '$libs/analytics';

	const { packages: allPackages } = packagesStore;

	export let stateFilters: {[key: string]: boolean};
	export let sortBy: "popularity" | "most recent" = 'popularity';
	export let sortDirection: 'asc' | 'desc' = 'desc';

	const loadMore = 9;
	let limit = loadMore;
	$: filterExists = Object.keys(stateFilters).some((k) => stateFilters[k]);
	$: packages = $allPackages
		.sort((a, b) => {
			if (sortBy === 'popularity') {
				const aPop = +a.dl_count + a.installs;
				const bPop = +b.dl_count + b.installs;
				return sortDirection === 'asc' ? aPop - bPop : bPop - aPop;
			} else {
				// most recent
				const aDate = new Date(a.last_modified);
				const bDate = new Date(b.last_modified);
				return sortDirection === 'asc' ? +aDate - +bDate : +bDate - +aDate;
			}
		})
		.filter((pkg) => {
			if (!filterExists || pkg.state === PackageStates.INSTALLING) return true;
			return stateFilters[pkg.state];
		});
</script>

<!-- <header class="flex items-center justify-between z-50 w-full absolute">
	<h1 class="text-primary text-4xl font-bold">{$t("home.all-packages")}</h1>
	<div class="flex">
		<section class="border-gray h-10 w-48 border rounded-sm">
			<SortingButtons {onSort} />
		</section>
	</div>
</header> -->
<div>
	<ul class="grid grid-cols-3 gap-2 bg-black">
		{#if packages.length > 0}
			{#each packages as pkg, index}
				{#if index < limit}
					<div class={pkg.state === PackageStates.INSTALLING ? 'animate-pulse' : ''}>
						<Package
							{pkg}
							onClick={async () => {
								try {
									pkg.state = PackageStates.INSTALLING;
									await installPackage(pkg);
									trackInstall(pkg.full_name);
									pkg.state = PackageStates.INSTALLED;
	
									packagesStore.updatePackage(pkg.full_name, {
										state: PackageStates.INSTALLED, // this would also mean its the latest version
									});
								} catch (error) {
									let message = 'Unknown Error'
									if (error instanceof Error) message = error.message
									trackInstallFailed(pkg.full_name, message || "unknown");
								}
							}}
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