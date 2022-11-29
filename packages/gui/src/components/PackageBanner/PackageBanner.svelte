<script lang="ts">
	import '$appcss';
	import '@tea/ui/icons/icons.css';
	import type { Package } from '@tea/ui/types';

	export let pkg: Package;
</script>

<section class="border-gray border bg-black">
	<header class="flex p-2">
		<figure class="w-1/3 grow-1">
			<img width={260} src={pkg.thumb_image_url} alt={pkg.full_name} />
		</figure>
		<article class="w-2/3 p-4">
			<h3 class="text-primary">{pkg.full_name}</h3>
			{#if pkg.maintainer}
				<h3>* {pkg.maintainer}</h3>
			{/if}
			<span>stars</span>
			<p>{pkg.desc}</p>
		</article>
	</header>
	<footer class="flex text-white">
		<div>sh &lt;(curl tea.xyz ) +textin</div>
		<div>copy</div>
		<div>open terminal</div>
	</footer>
</section>
