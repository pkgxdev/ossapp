<script lang="ts">
	import { authStore, navStore } from "$libs/stores";
	import { getSession } from "@native";
	import { baseUrl } from "$libs/v1-client";
	import { shellOpenExternal } from "@native";
	import mouseLeaveDelay from "@tea/ui/lib/mouse-leave-delay";
	const { user } = authStore;

	$: authenticating = false;

	$: isLogoutOpen = false;

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
		isLogoutOpen = false;
	};

	const logout = () => authStore.clearSession();

	const preventDoubleClick = (evt: MouseEvent) => evt.stopPropagation();
</script>

{#if $user}
	<div class="relative" use:mouseLeaveDelay={2000} on:leave_delay={() => (isLogoutOpen = false)}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<section
			class="border-gray text-gray group flex h-[28px] w-[120px] items-center justify-between rounded-sm border bg-black pl-2 text-sm transition-all 
		hover:bg-[#e1e1e1] hover:text-black"
			on:click={() => (isLogoutOpen = !isLogoutOpen)}
			on:dblclick={preventDoubleClick}
		>
			<div class="text-gray line-clamp-1 group-hover:text-black">@{$user?.login}</div>
			<img
				id="avatar"
				class="flex rounded-sm"
				src={$user?.avatar_url || "/images/bored-ape.png"}
				alt="profile"
			/>
		</section>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="border-gray text-gray group absolute z-50 mt-1 flex h-[28px] w-[120px] items-center justify-between rounded-sm border bg-black pl-3 text-sm transition-all 
		hover:bg-[#e1e1e1] hover:text-black"
			class:invisible={!isLogoutOpen}
			class:visible={isLogoutOpen}
			on:click={logout}
		>
			logout
		</div>
	</div>
{:else}
	<button
		class="border-gray text-gray h-[28px] w-[120px] rounded-sm border px-1 text-sm transition-all hover:bg-[#e1e1e1] hover:text-black"
		class:animate-pulse={authenticating}
		on:click={openGithub}
		on:dblclick={preventDoubleClick}
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
