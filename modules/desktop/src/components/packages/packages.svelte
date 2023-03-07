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
	import SortingButtons from '$components/search-packages/sorting-buttons.svelte';
	export let title = 'Packages';
	export let category = ''; // filter

	let installedOnly = false;

	let sortBy = 'popularity';
	let sortDirection: 'asc' | 'desc' = 'desc';

	let packages: GUIPackage[] = [];

	packagesStore.subscribe((ps) => {
		packages = category ?
			ps.filter((p) => (p.categories || []).includes(category)) :
			ps;
	});

	const onSort = (opt: string, dir: 'asc' | 'desc') => {
		sortBy = opt;
		sortDirection = dir;
		// setPackages(packages);
	};

</script>

<header class="flex items-center justify-between my-4">
	<h1 class="text-primary text-4xl font-bold">{title}</h1>
	<div class="flex">
		<section class="border border-gray mr-2 rounded-sm h-10 text-gray font-thin">
			<button on:click={() => installedOnly = false} class={`px-2 ${installedOnly ? "":"active"}`}>All packages</button>
			<button on:click={() => installedOnly = true } class={`px-2 ${installedOnly ? "active":""}`}>installed only</button>
		</section>
		<section class="border-gray h-10 w-48 border rounded-sm">
			<SortingButtons {onSort} />
		</section>
	</div>
</header>
<ul class="grid grid-cols-3 bg-black">
	{#if packages.length > 0}
		{#each packages as pkg}
			<div class={pkg.state === PackageStates.INSTALLING ? 'animate-pulse' : ''}>
				<Package
					{pkg}
					onClick={async () => {
						try {
							pkg.state = PackageStates.INSTALLING;
							await installPackage(pkg);
							trackInstall(pkg.full_name);
							pkg.state = PackageStates.INSTALLED;
						} catch (error) {
							let message = 'Unknown Error'
  						if (error instanceof Error) message = error.message
							trackInstallFailed(pkg.full_name, message || "unknown");
						}
					}}
				/>
			</div>
		{/each}
	{:else}
		{#each Array(9) as _}
			<section class="h-50 border-gray border p-4">
				<Preloader />
			</section>
		{/each}
	{/if}
</ul>

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