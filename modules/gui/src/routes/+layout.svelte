<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import { navigating } from '$app/stores';
	import NavBar from '$components/NavBar/NavBar.svelte';
	import FooterLinks from '$components/FooterLinks/FooterLinks.svelte';

	import { backLink as backLinkStore } from '$libs/stores';
	import SearchPopupResults from '$components/SearchPopupResults/SearchPopupResults.svelte';

	let view: HTMLElement;

	let backLink = '';
	backLinkStore.subscribe((v) => {
		backLink = v;
	});

	$: if ($navigating) view.scrollTop = 0;
</script>

<div id="main-layout">
	<nav class="border border-t-0 border-l-0 border-b-0 border-gray">
		<NavBar />
	</nav>
	<section class="pt-24" bind:this={view}>
		{#if backLink}
			<header class="border-b border-gray px-16 text-3xl text-gray hover:text-primary">
				<a href={backLink}>&#8592</a>
			</header>
		{/if}
		<figure />

		<div class="content">
			<!-- all pages get inserted in this slot -->
			<slot />
		</div>
		<footer class="mt-8 w-full border border-r-0 border-gray bg-black">
			<FooterLinks />
		</footer>
		<SearchPopupResults />
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

	figure {
		z-index: 0;
		position: fixed;
		top: 220px;
		left: 240px;
		right: 0px;
		bottom: 0px;
		background-image: url('/images/gui-background-grid.svg');
	}
	@media screen and (min-width: 1440px) {
		figure {
			background-size: cover;
			background-repeat: repeat-y;
		}
		.content {
			padding: 0vw 3.6vw !important;
		}
	}
	@media screen and (max-width: 1440px) {
		figure {
			background-size: contain;
			background-repeat: repeat;
		}
		.content {
			padding: 0vw 3.33vw;
		}
	}
	header {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 40px;
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
