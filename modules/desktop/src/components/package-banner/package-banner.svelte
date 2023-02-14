<script lang="ts">
	import '$appcss';
	import '@tea/ui/icons/icons.css';
	import type { Package, Bottle } from '@tea/ui/types';
	import Button from '@tea/ui/Button/Button.svelte';
	import StarRating from '@tea/ui/star-rating/star-rating.svelte';
	import { onMount } from 'svelte';
	import { getPackageBottles } from '@api';

	const { ipcRenderer } = window.require('electron');

	export let pkg: Package;
	let bottles: Bottle[] = [];
	let packageRating = 0;
	let copyButtonText = 'COPY';
	const copyValue = `sh <(curl tea.xyz ) +${pkg.full_name}`;

	const onCopy = () => {
		copyButtonText = 'COPIED!';
		navigator.clipboard.writeText(copyValue);
	};

	const onOpenTerminal = () => {
		ipcRenderer.invoke('open-terminal', { cmd: `sh <(curl tea.xyz) +${pkg.full_name}` });
	}

	onMount(async () => {
		try {
			bottles = await getPackageBottles(pkg.full_name);
		} catch (err) {
			console.error(err);
		}
	});
</script>

<section class="border-gray mt-4 border bg-black">
	<header class="flex p-2">
		<figure class="grow-1 w-1/3">
			<img width={260} src={pkg.thumb_image_url} alt={pkg.full_name} />
		</figure>
		<article class="w-2/3 p-4 pt-8">
			<h3 class="text-primary text-3xl">{pkg.full_name}</h3>
			<h3>&#x2022; {pkg.maintainer || ''}{pkg.maintainer ? ' |' : ''} {bottles.length} bottles</h3>
			<div class="mt-4">
				<StarRating maxRating={5} rating={packageRating} />
			</div>
			<p class="font-sono mt-4 text-sm">{pkg.desc}</p>
		</article>
	</header>

	<footer class="border-gray flex h-20 border-t text-white">
		<input class="click-copy flex-grow bg-black pl-4" disabled value={copyValue} />
		<Button class="w-16 border-0 border-l-2 text-sm" onClick={onCopy}>{copyButtonText}</Button>
		<Button class="w-56 border-0 border-l-2 text-sm" onClick={onOpenTerminal}
			>OPEN IN TERMINAL</Button
		>
	</footer>
</section>
