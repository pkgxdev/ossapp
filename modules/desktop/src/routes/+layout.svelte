<script lang="ts">
	import '$appcss';
	import { navigating } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import TopBar from '$components/top-bar/top-bar.svelte';
	import FooterLinks from '$components/footer-links/footer-links.svelte';
	import { navStore, notificationStore } from '$libs/stores';

	import Notification from "@tea/ui/notification/notification.svelte";

	import SearchPopupResults from '$components/search-popup-results/search-popup-results.svelte';

  	import TeaUpdate from '$components/tea-update/tea-update.svelte';

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
	{#each $notificationStore as notification}
		<Notification {notification} />
	{/each}
	<section class="relative pt-24" bind:this={view}>
		<div class="content">
			<TeaUpdate />
		</div>
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
		overflow: hidden;
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
