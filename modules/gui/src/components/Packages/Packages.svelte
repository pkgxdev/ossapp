<script lang="ts">
	import '$appcss';
	import type { GUIPackage } from '$libs/types';
	import { PackageStates } from '$libs/types';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import PackageCard from '@tea/ui/PackageCard/PackageCard.svelte';
	import { onMount } from 'svelte';

	// TODO: replace with getting foundation essentials
	import { getTopPackages } from '$libs/api/mock';
	import { installPackage } from '@api';

	export let title = 'Packages';

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
			packages = await getTopPackages();
		}
	});
</script>

<header class="border-gray text-primary flex items-center justify-between border bg-black p-4">
	<span>{title}</span>
	<a href="/packages" class="font-sono text-sm underline">View all packages</a>
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
