<script lang="ts">
	import '$appcss';
	import type { GUIPackage } from '$libs/types';
	import type { Package } from '@tea/ui/types';
	import { PackageStates } from '$libs/types';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import PackageCard from '@tea/ui/package-card/package-card.svelte';
	import { onMount } from 'svelte';
	import { installPackage } from '@native';
	import { packagesStore } from '$libs/stores';

	export let pkg: Package;

	let packages: GUIPackage[] = [];

	const getCTALabel = (state: PackageStates): string => {
		return {
			[PackageStates.AVAILABLE]: 'INSTALL',
			[PackageStates.INSTALLED]: 'INSTALLED',
			[PackageStates.INSTALLING]: 'INSTALLING',
			[PackageStates.UNINSTALLED]: 'RE-INSTALL'
		}[state];
	};

	onMount(async () => {
		if (!packages.length) {
			const matches = await packagesStore.search(pkg.desc, 4);
			packages = matches.filter((mp) => mp.full_name !== pkg.full_name).slice(0, 3);
		}
	});
</script>

<header class="border-gray text-primary flex items-center justify-between border bg-black p-4">
	<span>MORE LIKE THIS</span>
</header>
<ul class="grid grid-cols-3 bg-black">
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
		{#each Array(9) as _}
			<section class="h-50 border-gray border p-4">
				<Preloader />
			</section>
		{/each}
	{/if}
</ul>
