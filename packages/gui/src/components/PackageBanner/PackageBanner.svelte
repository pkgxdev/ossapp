<script lang="ts">
	import '$appcss';
	import '@tea/ui/icons/icons.css';
	import type { Package } from '@tea/ui/types';
	import Button from '@tea/ui/Button/Button.svelte';
	import StarRating from '@tea/ui/StarRating/StarRating.svelte';

	export let pkg: Package;

	let packageRating = 0;
	let copyButtonText = 'COPY';
	const copyValue = `sh <(curl tea.xyz ) +${pkg.full_name}`;

	const onCopy = () => {
		copyButtonText = 'COPIED!';
		navigator.clipboard.writeText(copyValue);
	};
</script>

<section class="border-gray border bg-black mt-4">
	<header class="flex p-2">
		<figure class="w-1/3 grow-1">
			<img width={260} src={pkg.thumb_image_url} alt={pkg.full_name} />
		</figure>
		<article class="w-2/3 p-4">
			<h3 class="text-primary text-5xl">{pkg.full_name}</h3>
			{#if pkg.maintainer}
				<h3>* {pkg.maintainer}</h3>
			{/if}
			<div class="mt-4">
				<StarRating maxRating={5} rating={packageRating} />
			</div>
			<p class="font-sono mt-4 text-sm">{pkg.desc}</p>
		</article>
	</header>
	<footer class="flex text-white border-gray border-t h-20">
		<input class="flex-grow bg-black pl-4" disabled value={copyValue} />
		<Button class="text-sm border-0 border-l-2 w-16" onClick={onCopy}>{copyButtonText}</Button>
		<Button class="text-sm border-0 border-l-2 w-56" onClick={() => console.log('cli')}
			>OPEN IN TERMINAL</Button
		>
	</footer>
</section>
