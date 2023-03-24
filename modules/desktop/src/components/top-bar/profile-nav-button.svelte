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
		<figure class="flex gap-2 h-{8} mr-1 border border-gray rounded-md items-center px-1">
			<div class="text-gray font-inter bg-black">@{$user.login}</div>
			<div class="overflow-clip w-{6} h-{6} rounded-sm">
				<img class="w-{6} w-{6} h-{6}" src={$user.avatar_url || '/images/bored-ape.png'} alt="profile" />
			</div>
		</figure>
	{:else}
		<div class="icon-hamburger-icon-square text-xl mt-2 py-4 px-2 text-gray"></div>
	{/if}
</button>
