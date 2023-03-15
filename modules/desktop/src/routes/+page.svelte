<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations';
	import { navStore } from '$libs/stores';
	import Packages from '$components/packages/packages.svelte';
	import Checkbox from "@tea/ui/checkbox/checkbox.svelte";
	import { PackageStates } from '$libs/types';
	import SortingButtons from "$components/search-packages/sorting-buttons.svelte";

	const { sideNavOpen } = navStore;

	
	let stateFilters = {
		[PackageStates.AVAILABLE]: false,
		[PackageStates.NEEDS_UPDATE]: false,
		[PackageStates.INSTALLED]: false,
	}

	let sortBy: "popularity" | "most recent" = "popularity";
	let sortDirection: "asc" | "desc" = "desc";

	// onSort: (opt: string, dir: 'asc' | 'desc') => void;
</script>

<div id="package-container">
	<Packages {stateFilters} {sortBy} {sortDirection}/>
</div>
<aside class="border border-gray p-2">
	<h2 class="text-xl text-primary">Search OSS</h2>
	<h3 class="text-lg text-primary">Status</h3>
	<ul>
		<li>
			<Checkbox label={"Not installed"} bind:checked={stateFilters[PackageStates.AVAILABLE]} />
		</li>
		<li>
			<Checkbox label={"Installed"} bind:checked={stateFilters[PackageStates.INSTALLED]} />
		</li>
		<li>
			<Checkbox label={"Update Available"} bind:checked={stateFilters[PackageStates.NEEDS_UPDATE]} />
		</li>
	</ul>
</aside>
<header class={`transition-all px-2 flex justify-between items-center align-middle ${$sideNavOpen ? "min": ""}`}>
	<h1 class="text-primary mt-4 text-2xl font-bold">{$t("home.all-packages")}</h1>
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
		width: calc(100% - 180px);
		margin-left: 180px;
	}

	aside {
		position: fixed;
		top: 100px;
		left: 10px;
		height: calc(100% - 110px);
		width: 170px;
	}
	header {
		position: fixed;
		top: 40px;
		left: 0px;
		height: 50px;
		width: 100%;
		background-image: linear-gradient(black, rgba(0,0,0,0.6), rgba(0,0,0,0));
  	/* background: linear-gradient(rgba(255,0,0,0), rgba(0,0,0,0)); */
	}

	header.min {
		width: 75%;
	}
</style>
