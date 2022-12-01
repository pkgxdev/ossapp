<script lang="ts">
	import '$appcss';
	import ReviewCard from '@tea/ui/ReviewCard/ReviewCard.svelte';
</script>

<header class="text-primary bg-black border border-gray p-4">REVIEWS (31)</header>
<section class="grid bg-black grid-cols-3 font-machina">
	<div class="border border-gray p-4">
		<ReviewCard
			review={{
				title: 'Something not good',
				comment:
					'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatum molestiae esse quisquam earum debitis',
				rating: 2
			}}
		/>
	</div>
	<div class="border border-gray p-4">
		<ReviewCard
			review={{
				title: 'Something meh',
				comment:
					'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatum molestiae esse quisquam earum debitis',
				rating: 3
			}}
		/>
	</div>
	<div class="border border-gray p-4">
		<ReviewCard
			review={{
				title: 'Something good',
				comment:
					'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatum molestiae esse quisquam earum debitis',
				rating: 4
			}}
		/>
	</div>
</section>
