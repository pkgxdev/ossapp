<script lang="ts">
	import { authStore, navStore } from "$libs/stores";
	import { getSession } from "@native";
	import { baseUrl } from "$libs/v1-client";
	import { shellOpenExternal } from "@native";
	const { user } = authStore;

	$: authenticating = false;

	const openGithub = async () => {
		if (!authenticating) {
			authenticating = true;
			try {
				const session = await getSession();

				if (session && session.device_id) {
					shellOpenExternal(`${baseUrl}/auth/user?device_id=${session.device_id}`);
					authStore.pollSession();
				} else {
					throw new Error("possible no internet connection");
				}
			} catch (error) {
				console.error(error);
			} finally {
				authenticating = false;
			}
		}
	};
</script>

{#if $user}
	<section
		class="border-gray text-gray group flex h-[28px] w-[120px] items-center justify-between rounded-sm border pl-2 text-sm transition-all 
  hover:bg-[#e1e1e1] hover:text-black"
	>
		<div class="text-gray line-clamp-1 group-hover:text-black">@{$user?.login}</div>
		<img
			id="avatar"
			class="flex rounded-sm"
			src={$user?.avatar_url || "/images/bored-ape.png"}
			alt="profile"
		/>
	</section>
{:else}
	<button
		class="border-gray text-gray h-[28px] w-[120px] rounded-sm border px-1 text-sm transition-all hover:bg-[#e1e1e1] hover:text-black"
		class:animate-pulse={authenticating}
		on:click={openGithub}
	>
		login
	</button>
{/if}

<style>
	#avatar {
    padding: 1px;
		height: 26px !important;
		width: 26px !important;
	}
</style>
