<script lang="ts">
	import PanelHeader from '@tea/ui/PanelHeader/PanelHeader.svelte';
	import MiniPackageCard from '@tea/ui/MiniPackageCard/MiniPackageCard.svelte';
	import type { Category } from '$libs/types';
	import { onMount } from 'svelte';
	import { getCategorizedPackages } from '@api';

	let categories: Category[] = [];

	onMount(async () => {
		categories = await getCategorizedPackages();
	});
</script>

{#each categories as category}
	<PanelHeader ctaLabel={category.cta_label} ctaLink={'#'} title={category.label} />
	<ul class="grid grid-cols-3 border border-r-0 border-gray bg-black">
		{#each category.packages as pkg}
			<div class="border border-t-0 border-l-0 border-gray p-4">
				<MiniPackageCard
					{pkg}
					ctaLabel="DETAILS"
					onClickCTA={async () => {
						console.log('do something with:', pkg.full_name);
					}}
				/>
			</div>
		{/each}
	</ul>
{/each}
