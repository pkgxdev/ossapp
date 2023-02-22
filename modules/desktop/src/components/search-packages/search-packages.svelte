<script lang="ts">
	import '$appcss';
	import { packagesStore } from '$libs/stores';
	import SortingButtons from './sorting-buttons.svelte';
	import type { GUIPackage } from '$libs/types';
	import { PackageStates } from '$libs/types';
	import PackageCard from '@tea/ui/package-card/package-card.svelte';
	import SearchInput from '@tea/ui/search-input/search-input.svelte';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';

	import { installPackage } from '@native';

	let packages: GUIPackage[] = [];

	let sortBy = 'popularity';
	let sortDirection: 'asc' | 'desc' = 'desc';

	const searchLimit = 10;

	const setPackages = (pkgs: GUIPackage[], isSearch?: boolean) => {
		packages = isSearch
			? pkgs
			: pkgs.sort((a, b) => {
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

	const onSearch = async (term: string) => {
		if (term !== '' && term.length > 1) {
			const matchingPackages: GUIPackage[] = await packagesStore.search(term, searchLimit);
			setPackages(matchingPackages, true);
		} else {
			setPackages(packagesStore.packages, false);
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

	packagesStore.subscribe(setPackages);
</script>

<div class="border-gray border bg-black">
	<section class="flex items-center justify-between">
		<div>
			<SearchInput size="medium" {onSearch} />
		</div>
		<div class="pr-4">
			<section class="border-gray h-12 w-48 border">
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
				<section class="h-50 border-gray border p-4">
					<Preloader />
				</section>
			{/each}
		{/if}
	</ul>
</div>
