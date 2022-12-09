<script lang="ts">
	import { searchStore } from '$libs/stores';
	let term: string;

	searchStore.subscribe((v) => (term = v));
</script>

<section
	class={`relative w-full overflow-hidden bg-gray text-center align-middle transition-all delay-500 duration-1000 ${
		term ? 'mb-10 h-56 pt-16' : 'h-0'
	}`}
>
	<p>It seems you have search for "{term}": here are the results</p>
	<ul>
		<li>result 1 <a href="/" class="text-primary">link 1</a></li>
		<li>result 2 <a href="/" class="text-primary">link 2</a></li>
		<li>result 3 <a href="/" class="text-primary">link 3</a></li>
	</ul>
</section>

<style>
	section {
		z-index: 10;
	}
</style>
