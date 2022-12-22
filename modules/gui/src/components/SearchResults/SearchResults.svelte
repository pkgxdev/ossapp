<script lang="ts">
	import { searchStore } from '$libs/stores';
	let term: string;
	searchStore.subscribe((v) => (term = v));
</script>

<section class={term ? 'show' : ''}>
	<div class="border border-gray bg-black">
		<header class="p-4 text-2xl text-primary">
			Showing search results for `{term}`
		</header>
		<menu class="flex h-8 w-full gap-4 bg-accent px-4 text-xs">
			<button>packages (33)</button>
			<button>articles (33)</button>
			<button>workshops (33)</button>
		</menu>
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 240px;
		right: 0;
		background: rgba(0, 0, 0, 0.7);
		transition: opacity 0.3s ease-in-out;
		padding: 36px;
		opacity: 0%;
		overflow: hidden;
		height: 0px;
	}

	section.show {
		opacity: 100%;
		height: 100%;
	}

	section > div {
		height: 0%;
		transition: height 0.6s ease-in-out;
	}

	section.show > div {
		height: 90%;
	}
</style>
