<script lang="ts">
	import "../app.css";

	export let rating = 0;
	export let maxRating = 5;

	let stars: string[] = [];
	for (let i = 1; i <= maxRating; i++) {
		const mod1 = rating % 1;

		if (i < rating) {
			stars.push("icon-star-full");
		} else if (mod1 >= 0.5) {
			stars.push("icon-star-half");
		} else {
			stars.push("icon-star-empty");
		}
	}
</script>

<section class="flex text-primary">
	{#each stars as star}
		<i class={star} />
	{/each}
</section>
