<script lang="ts">
	import '$appcss';
	import ArticleCard from '@tea/ui/article-card/ArticleCard.svelte';

	const doStuff = () => {
		console.log('do stuff!');
	};
</script>

<header class="border-gray text-primary border bg-black p-4">GETTING STARTED WITH TEA</header>
<section class="grid grid-cols-3 bg-black">
	<div class="border-gray border p-4">
		<ArticleCard
			content={{
				title: 'installing tea',
				copy: "It's time to take your first sip! Click below to visit our tea-cli documentation page.",
				img_url: '/images/bored-ape.png',
				cta_label: 'Get Started',
				link: '/cli'
			}}
		/>
	</div>
	<div class="border-gray border p-4">
		<ArticleCard
			content={{
				title: 'authenticating',
				copy: 'Using tea without authenticating is like playing a video game without the DLC. Join us today!',
				img_url: '/images/bored-ape.png',
				cta_label: 'Get Started',
				link: ''
			}}
			onClick={doStuff}
		/>
	</div>
	<div class="border-gray border p-4">
		<ArticleCard
			content={{
				title: 'give us a star',
				copy: 'Revolutions are built on the will of the people. Show your support for a more equitable internet.',
				img_url: '/images/bored-ape.png',
				cta_label: 'Get Started'
			}}
		/>
	</div>
</section>
