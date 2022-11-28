<script type="ts">
	import '$appcss';

	import { packages as packagesStore, initializePackages } from '$libs/stores';

	import type { Package } from '@tea/ui/types';
	import PackageCard from '@tea/ui/PackageCard/PackageCard.svelte';
	import SearchInput from '@tea/ui/SearchInput/SearchInput.svelte';
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
	<section class="flex justify-between items-center">
		<div>
			<SearchInput size="medium" />
		</div>
		<div class="pr-4">
			<section class="h-12 w-48 border border-gray" />
		</div>
	</section>
	<ul class="grid grid-cols-3">
		{#each packages as pkg}
			<PackageCard {pkg} link={`/packages/${pkg.full_name}`} />
		{/each}
	</ul>
</div>
