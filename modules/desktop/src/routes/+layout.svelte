<script lang="ts">
	import '$appcss';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import TopBar from '$components/top-bar/top-bar.svelte';
	import PopoutMenu from '$components/popout-menu/popout-menu.svelte';
	import Footer from '$components/footer/footer.svelte';
	import { navStore, packagesStore, searchStore } from '$libs/stores';
	import { listenToChannel } from "@native";
	import Mousetrap from 'mousetrap';

	import SearchPopupResults from '$components/search-popup-results/search-popup-results.svelte';
	import { getProtocolPath } from '@native';

  import { onMount } from 'svelte';

	let view: HTMLElement;

	const { sideNavOpen, setNewPath } = navStore;
	const { searching } = searchStore;

	$: if ($navigating) view.scrollTop = 0;
	

	afterNavigate(({ from, to }) => {
		if (to && to?.route.id && from && from?.url) {
			const nextPath = to.url.href.replace(to.url.origin, '');
			const fromPath = from?.url.href.replace(from.url.origin, '');
			setNewPath(nextPath, fromPath || '/');
		}
	});

	const syncPath = async () => {
		// used by the tea:// protocol to suggest a path to open
		const path = await getProtocolPath();
		if (path) goto(path);
	}

	onMount(async () => {
		// used by the tea:// protocol to suggest a path to open
		syncPath();
		listenToChannel("sync-path", syncPath);
		Mousetrap.bind(['command+k', 'ctrl+k'], function() {
				searchStore.searching.set(!$searching);
        // return false to prevent default browser behavior
        // and stop event from bubbling
        return false;
    });
		packagesStore.init();
	});
</script>

<div id="main-layout" class="transition-all font-inter border border-gray rounded-xl">
	<TopBar />
	<section class="relative" bind:this={view}>
		<div class="content">
			<slot/>
		</div>
		<SearchPopupResults />
	</section>
	<Footer/>
</div>
{#if $sideNavOpen}
	<aside class="fixed z-50 border border-gray rounded-md  bg-black transition-all">
		<PopoutMenu/>
	</aside>
{/if}


<style>
	#main-layout {
		height: 100vh;
		overflow: hidden;
	}
	section {
		height: calc(100vh - 50px - 25px); /* win.height - header - footer */
		overflow-y: auto;
		box-sizing: border-box;
	}

	slot {
		z-index: 1;
	}

	div {
		position: relative;
	}

	aside {
		top: 52px;
		right: 5px;
		width: 190px;
		overflow: clip;
		height: auto;
		opacity: 1;
	}

	.content {
		padding-left: 4px;
		padding-right: 4px;
	}
</style>
