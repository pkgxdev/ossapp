<script lang="ts">
	import '$appcss';
	import { t } from "$libs/translations";
	import { navigating } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import TopBar from '$components/top-bar/top-bar.svelte';
	import SideBar from '$components/side-bar/side-bar.svelte';
	import { navStore, notificationStore } from '$libs/stores';

	import Notification from "@tea/ui/notification/notification.svelte";

	import SearchPopupResults from '$components/search-popup-results/search-popup-results.svelte';

  import TeaUpdate from '$components/tea-update/tea-update.svelte';

	let view: HTMLElement;

	const { sideNavOpen, setNewPath } = navStore;

	$: if ($navigating) view.scrollTop = 0;

	afterNavigate(({ from, to }) => {
		if (to && to?.route.id && from && from?.url) {
			const nextPath = to.url.href.replace(to.url.origin, '');
			const fromPath = from?.url.href.replace(from.url.origin, '');
			setNewPath(nextPath, fromPath || '/');
		}
	});

</script>

<div id="main-layout" class={`${$sideNavOpen ? "w-3/4" : "w-full"} transition-all`}>
	<TopBar />
	{#each $notificationStore as notification}
		<Notification
			notification={{
				...notification,
				// TODO this looks nasty but cleanup later.
				message: notification.i18n_key ? $t(notification.i18n_key, notification.params) : notification.message
			}}
				onClose={() => {
				notificationStore.remove(notification.id);
			}}
		/>
	{/each}
	<section class="relative pt-4" bind:this={view}>
		<div class="content">
			<TeaUpdate />
		</div>
		<div class="content">
			<slot />
		</div>
		<SearchPopupResults />
	</section>
</div>
<aside class={`absolute h-full w-1/4 bg-gray bg-opacity-10 top-0 transition-all  ${$sideNavOpen ? "right-0":"-right-1/4"}`}>
	<SideBar/>
</aside>


<style>
	#main-layout {
		height: 100vh;
		overflow: hidden;
	}
	section {
		height: calc(100vh - 42px);
		overflow-y: scroll;
		box-sizing: border-box;
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
</style>
