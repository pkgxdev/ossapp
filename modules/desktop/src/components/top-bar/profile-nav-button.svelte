<script lang="ts">
	import { navStore } from '$libs/stores';
	const { sideNavOpen } = navStore;

	const toggleSideNav = () => {
		sideNavOpen.update((v) => !v);
	}
</script>

<button class="flex items-center justify-center py-2 cursor-default hover:bg-white h-{8} rounded-sm" on:click={toggleSideNav}>
	<div class="icon-hamburger-icon-square text-xl mt-2 py-4 px-2 text-gray hover:text-black"></div>
</button>
