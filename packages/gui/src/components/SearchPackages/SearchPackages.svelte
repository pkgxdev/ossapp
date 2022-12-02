<script type="ts">
	import '$appcss';
	import Fuse from 'fuse.js';
	import { packages as packagesStore, initializePackages } from '$libs/stores';
	import SortingButtons from './SortingButtons.svelte';
	import type { GUIPackage } from '$libs/types';
	import { PackageStates } from '$libs/types';
	import PackageCard from '@tea/ui/PackageCard/PackageCard.svelte';
	import SearchInput from '@tea/ui/SearchInput/SearchInput.svelte';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import { onMount } from 'svelte';

	import { installPackage } from '@api';

	let allPackages: GUIPackage[] = [];
	let packagesIndex: Fuse<GUIPackage>;
	let packages: GUIPackage[] = [];
	let initialized = false;

	let sortBy = 'popularity';
	let sortDirection: 'asc' | 'desc' = 'desc';

	const searchLimit = 5;

	const setPackages = (pkgs: GUIPackage[], isSearch?: boolean) => {
		packages = isSearch ? pkgs : pkgs.sort((a, b) => {
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
		if (term !== '' && term.length > 1) {
			const res = packagesIndex.search(term);
			const matchingPackages: GUIPackage[] = [];
			for (let i = 0; i < searchLimit; i++) {
				if (res[i]) {
					matchingPackages.push(res[i].item);
				}
			}
			setPackages(matchingPackages, true);
		} else {
			setPackages(allPackages);
		}
	};

	const onSort = (opt: string, dir: 'asc' | 'desc') => {
		sortBy = opt;
		sortDirection = dir;
		setPackages(packages);
	};

	const getCTALabel = (state: PackageStates): string => {
		return {
			[PackageStates.AVAILABLE]: 'INSTALL',
			[PackageStates.INSTALLED]: 'INSTALLED',
			[PackageStates.INSTALLING]: 'INSTALLING',
			[PackageStates.UNINSTALLED]: 'RE-INSTALL'
		}[state];
	};
</script>

<div class="border border-gray bg-black">
	<section class="flex items-center justify-between">
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
		{#if packages.length > 0}
			{#each packages as pkg}
				<div class={pkg.state === PackageStates.INSTALLING ? 'animate-pulse' : ''}>
					<PackageCard
						{pkg}
						link={`/packages/${pkg.slug}`}
						ctaLabel={getCTALabel(pkg.state)}
						onClickCTA={async () => {
							try {
								pkg.state = PackageStates.INSTALLING;
								await installPackage(pkg.full_name);
								pkg.state = PackageStates.INSTALLED;
							} catch (error) {
								console.error(error);
							}
						}}
					/>
				</div>
			{/each}
		{:else}
			{#each Array(12) as _}
				<section class="h-50 border border-gray p-4">
					<Preloader />
				</section>
			{/each}
		{/if}
	</ul>
</div>
