<script lang="ts">
	import '$appcss';
	import ArticleCard from '@tea/ui/ArticleCard/ArticleCard.svelte';

	const doStuff = () => {
		console.log('do stuff!');
	};
</script>

<header class="text-primary border border-gray p-4">GETTING STARTED WITH TEA</header>
<section class="grid grid-cols-3">
	<div class="border border-gray p-4">
		<ArticleCard
			content={{
				title: 'installing tea',
				copy: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatum molestiae esse quisquam earum debitis.',
				img_url: '/images/bored-ape.png',
				cta_label: 'Get Started',
				link: '/cli'
			}}
		/>
	</div>
	<div class="border border-gray p-4">
		<ArticleCard
			content={{
				title: 'authenticating',
				copy: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatum molestiae esse quisquam earum debitis.',
				img_url: '/images/bored-ape.png',
				cta_label: 'Get Started',
				link: ''
			}}
			onClick={doStuff}
		/>
	</div>
	<div class="border border-gray p-4">
		<ArticleCard
			content={{
				title: 'give us a star',
				copy: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatum molestiae esse quisquam earum debitis.',
				img_url: '/images/bored-ape.png',
				cta_label: 'Get Started'
			}}
		/>
	</div>
</section>
