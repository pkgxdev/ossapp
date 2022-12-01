<script type="ts">
	import '$appcss';
	import Fuse from 'fuse.js';
	import { packages as packagesStore, initializePackages } from '$libs/stores';
	import SortingButtons from './SortingButtons.svelte';
	import type { Package } from '@tea/ui/types';
	import PackageCard from '@tea/ui/PackageCard/PackageCard.svelte';
	import SearchInput from '@tea/ui/SearchInput/SearchInput.svelte';
	import { onMount } from 'svelte';

	let allPackages: Package[] = [];
	let packagesIndex: Fuse<Package>;
	let packages: Package[] = [];
	let initialized = false;

	let sortBy = 'popularity';
	let sortDirection: 'asc' | 'desc' = 'desc';

	const searchLimit = 5;

	const setPackages = (pkgs: Package[]) => {
		console.log('pkgs sub', pkgs);
		packages = pkgs.sort((a, b) => {
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
		});
	};

	packagesStore.subscribe((v) => {
		allPackages = v;
		setPackages(allPackages);
		if (!packagesIndex) {
			// dont remove or this can get crazy
			packagesIndex = new Fuse(allPackages, {
				keys: ['name', 'full_name', 'desc']
			});
		}
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
			const matchingPackages = [];
			for (let i = 0; i < searchLimit; i++) {
				if (res[i]) {
					matchingPackages.push(res[i].item);
				}
			}
			setPackages(matchingPackages);
		} else {
			setPackages(allPackages);
		}
	};

	const onSort = (opt: string, dir: 'asc' | 'desc') => {
		sortBy = opt;
		sortDirection = dir;
		setPackages(packages);
	};
</script>

<div class="bg-black border border-gray">
	<section class="flex justify-between items-center">
		<div>
			<SearchInput size="medium" {onSearch} />
		</div>
		<div class="pr-4">
			<section class="h-12 w-48 border border-gray">
				<SortingButtons {onSort} />
			</section>
		</div>
	</section>
	<ul class="grid grid-cols-3">
		{#each packages as pkg}
			<PackageCard {pkg} link={`/packages/${pkg.slug}`} />
		{/each}
	</ul>
</div>
