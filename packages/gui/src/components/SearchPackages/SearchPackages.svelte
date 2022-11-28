<script type="ts">
	import '$appcss';
	import Fuse from 'fuse.js';
	import { packages as packagesStore, initializePackages } from '$libs/stores';

	import type { Package } from '@tea/ui/types';
	import PackageCard from '@tea/ui/PackageCard/PackageCard.svelte';
	import SearchInput from '@tea/ui/SearchInput/SearchInput.svelte';
	import { onMount } from 'svelte';

	let allPackages: Package[] = [];
	let packagesIndex: Fuse<Package>;
	let packages: Package[] = [];
	let initialized = false;
	const searchLimit = 5;

	packagesStore.subscribe((v) => {
		allPackages = v;
		packages = allPackages;
		packagesIndex = new Fuse(allPackages, {
			keys: ['name', 'full_name', 'desc']
		});
	});

	onMount(async () => {
		if (!packages.length && !initialized) {
			initialized = true;
			initializePackages();
		}
	});

	const onSearch = (term: string) => {
		if (term !== '' && term.length > 3) {
			const res = packagesIndex.search(term);
			packages = [];
			for (let i = 0; i < searchLimit; i++) {
				if (res[i]) {
					packages.push(res[i].item);
				}
			}
		} else {
			packages = allPackages;
		}
	};
</script>

<div class="bg-black border border-gray">
	<section class="flex justify-between items-center">
		<div>
			<SearchInput size="medium" {onSearch} />
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
