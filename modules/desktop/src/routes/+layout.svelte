<script lang="ts">
	import '$appcss';
	import { navigating } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import TopBar from '$components/TopBar/TopBar.svelte';
	import FooterLinks from '$components/FooterLinks/FooterLinks.svelte';
	import { navStore } from '$libs/stores';

	import SearchPopupResults from '$components/SearchPopupResults/SearchPopupResults.svelte';

	let view: HTMLElement;

	$: if ($navigating) view.scrollTop = 0;

	afterNavigate(({ from, to }) => {
		if (to && to?.route.id && from && from?.url) {
			const nextPath = to.url.href.replace(to.url.origin, '');
			const fromPath = from?.url.href.replace(from.url.origin, '');
			navStore.setNewPath(nextPath, fromPath || '/');
		}
	});
</script>

<div id="main-layout" class="w-full">
	<TopBar />
	<section class="relative pt-24" bind:this={view}>
		<figure />
		<div class="content">
			<slot />
		</div>
		<footer class="border-gray mt-8 w-full border border-r-0 bg-black">
			<FooterLinks />
		</footer>
		<SearchPopupResults />
	</section>
</div>

<style>
	#main-layout {
		height: 100vh;
	}
	section {
		height: calc(100vh - 82px);
		overflow-y: scroll;
		box-sizing: border-box;
	}

	figure {
		z-index: 0;
		position: fixed;
		top: 220px;
		left: 0px;
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
