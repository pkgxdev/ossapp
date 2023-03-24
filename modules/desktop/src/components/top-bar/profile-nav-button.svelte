<script lang="ts">
	import { authStore, navStore } from '$libs/stores';
	const { user } = authStore;
	const deviceId = authStore.deviceIdStore;
	const { sideNavOpen } = navStore;



	const toggleSideNav = () => {
		navStore.sideNavOpen.update((v) => !v);
	}

</script>

<button class="flex items-center justify-center py-2" on:click={toggleSideNav}>
	{#if $user}
		<figure class="flex rounded-full overflow-clip w-{8} h-{8} mr-1">
			<img src={$user.avatar_url || '/images/bored-ape.png'} alt="profile" />
		</figure>
	{:else}
		<div class="icon-hamburger-icon-square text-xl mt-2 py-4 px-2 text-gray"></div>
	{/if}
</button>
