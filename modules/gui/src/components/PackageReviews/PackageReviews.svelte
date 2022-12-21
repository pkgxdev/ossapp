<script lang="ts">
	import '$appcss';
	import { afterUpdate } from 'svelte';
	import ReviewCard from '@tea/ui/ReviewCard/ReviewCard.svelte';

	import type { Review } from '@tea/ui/types';
	export let reviews: Review[];

	const getColReviews = (n: number) => {
		return reviews.filter((_item, i) => (i - n) % 3 === 0);
	};

	let col1: Review[] = [];
	let col2: Review[] = [];
	let col3: Review[] = [];

	afterUpdate(() => {
		col1 = getColReviews(0);
		col2 = getColReviews(1);
		col3 = getColReviews(2);
	});

	// TODO: problem with reviews with differing heights
	// ideally they should work like metro-ui to not have extreme height diff between columns
</script>

<header class="border border-gray bg-black p-4 text-primary">REVIEWS ({reviews.length})</header>
<section class="flex flex-row flex-wrap bg-black font-machina">
	<div class="w-1/3 border-0 border-l-2 border-gray p-4">
		{#each col1 as review}
			<ReviewCard {review} />
			<div class="mt-4" />
		{/each}
	</div>
	<div class="w-1/3 border-0 border-l-2 border-gray p-4">
		{#each col2 as review}
			<ReviewCard {review} />
			<div class="mt-4" />
		{/each}
	</div>
	<div class="w-1/3 border-0 border-x-2 border-gray p-4">
		{#each col3 as review}
			<ReviewCard {review} />
			<div class="mt-4" />
		{/each}
	</div>
</section>
