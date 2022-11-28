<script type="ts">
	import '$appcss';

	import { packages as packagesStore, initializePackages } from '$libs/stores';

	import type { Package } from '@tea/ui/types';
	import PackageCard from '@tea/ui/PackageCard/PackageCard.svelte';

	import { onMount } from 'svelte';

	let packages: Package[] = [];
	let initialized = false;
	packagesStore.subscribe((v) => {
		packages = v;
	});

	onMount(async () => {
		if (!packages.length && !initialized) {
			initialized = true;
			initializePackages();
		}
	});
</script>

<div class="bg-black border border-gray">
	<section class="flex">
		<h2>Filter Packages</h2>
		<input type="search" class="text-white bg-black border border-gray" />
	</section>
	<ul class="grid grid-cols-3 mt-8">
		{#each packages as pkg}
			<PackageCard {pkg} link={`/packages/${pkg.full_name}`} />
		{/each}
	</ul>
</div>
