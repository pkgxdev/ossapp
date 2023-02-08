<script lang="ts">
	import '$appcss';
	import type { GUIPackage } from '$libs/types';
	import { PackageStates } from '$libs/types';
	import PanelHeader from '@tea/ui/PanelHeader/PanelHeader.svelte';
	import { packagesStore } from '$libs/stores';
	import MiniPackageCard from '@tea/ui/MiniPackageCard/MiniPackageCard.svelte';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	let packages: GUIPackage[] = [];

	packagesStore.subscribe((v) => {
		packages = v.filter((p) => p.state === PackageStates.INSTALLED);
	});
</script>

<PanelHeader title="My installs" ctaLabel="Check for updates >" ctaLink="#" />

<ul class="border-gray grid grid-cols-3 border border-r-0 bg-black">
	{#if packages.length > 0}
		{#each packages as pkg}
			<div class="border-gray border border-t-0 border-l-0 p-4">
				<MiniPackageCard
					{pkg}
					ctaLabel="DETAILS"
					onClickCTA={async () => {
						console.log('do something with:', pkg.full_name);
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
