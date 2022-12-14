<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import NavBar from '$components/NavBar/NavBar.svelte';
	import FooterLinks from '$components/FooterLinks/FooterLinks.svelte';

	import { backLink as backLinkStore } from '$libs/stores';

	let backLink = '';
	backLinkStore.subscribe((v) => {
		backLink = v;
	});
</script>

<div id="main-layout">
	<nav class="border border-t-0 border-l-0 border-b-0 border-gray">
		<NavBar />
	</nav>
	<section class="pt-24">
		{#if backLink}
			<header class="px-16 py-2 text-3xl text-gray hover:text-primary">
				<a href={backLink}>&#8592</a>
			</header>
		{/if}
		<figure />
		<div style="padding: 0vw 3.33vw;">
			<!-- all pages get inserted in this slot -->
			<slot />
		</div>
		<footer class="mt-8 w-full border border-r-0 border-gray bg-black">
			<FooterLinks />
		</footer>
	</section>
</div>

<style>
	#main-layout {
		width: 100vh;
		height: 100vh;
	}
	nav {
		position: fixed;
		width: 240px;
	}
	section {
		position: fixed;
		left: 240px;
		right: 0px;
		height: 100vh;
		overflow-y: scroll;
	}
	@media screen and (min-width: 1215px) {
		figure {
			position: fixed;
			z-index: 0;
			top: 220px;
			left: 240px;
			right: 0px;
			bottom: 0px;
			background-image: url('/images/gui-background-grid.svg');
			background-size: cover;
			background-repeat: repeat;
		}
	}
	@media screen and (max-width: 1215px) {
		figure {
			position: fixed;
			z-index: 0;
			top: 220px;
			left: 240px;
			right: 0px;
			bottom: 0px;
			background-image: url('/images/gui-background-grid.svg');
			background-size: contain;
			background-repeat: repeat;
		}
	}
	header {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 50px;
		border-bottom: #ccc 1px solid;
	}

	slot {
		z-index: 1;
	}

	div {
		position: relative;
	}

	footer {
		height: 100px;
	}
</style>
