<script lang="ts">
	import PanelHeader from '@tea/ui/panel-header/panel-header.svelte';
	import MiniPackageCard from '@tea/ui/mini-package-card/mini-package-card.svelte';
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
	<ul class="border-gray grid grid-cols-3 border border-r-0 bg-black">
		{#each category.packages as pkg}
			<div class="border-gray border border-t-0 border-l-0 p-4">
				<MiniPackageCard {pkg} ctaLabel="DETAILS" link={`/packages/${pkg.slug}`} />
			</div>
		{/each}
	</ul>
{/each}
