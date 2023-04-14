<script lang="ts">
	import { authStore, navStore } from "$libs/stores";
	import SelectLang from "$components/select-lang/select-lang.svelte";
	import { baseUrl } from "$libs/v1-client";
	import { shellOpenExternal, submitLogs } from "@native";
	import mouseLeaveDelay from "@tea/ui/lib/mouse-leave-delay";
	import { getSession } from "@native";

	const { user } = authStore;

	let authenticating = false;

	const openGithub = async () => {
		authenticating = true;
		if (!authenticating) {
			try {
				const session = await getSession();
				if (session && session.device_id) {
					shellOpenExternal(`${baseUrl}/auth/user?device_id=${session.device_id}`);
					authStore.pollSession();
				} else {
					throw new Error("possible no internet connection");
				}
			} catch (error) {
				submittedMessage = (error as Error).message;
				console.error(error);
			} finally {
				authenticating = false;
			}
		}
	};

	let submittedMessage = "";
	const onSubmitLogs = async () => {
		if (submittedMessage !== "syncing...") {
			submittedMessage = "syncing...";
			const msg = await submitLogs();
			submittedMessage = msg;
		}
	};

	const hidePopup = () => {
		navStore.sideNavOpen.set(false);
	};
</script>

<nav class="w-full p-2 text-sm" use:mouseLeaveDelay={2000} on:leave_delay={() => hidePopup()}>
	{#if $user}
		<section
			class="hover:bg-gray outline-gray flex items-center justify-between p-1 outline-1 hover:bg-opacity-25 hover:text-black hover:outline"
		>
			<div class="text-white">@{$user?.login}</div>
			<img
				id="avatar"
				class="rounded-sm"
				src={$user?.avatar_url || "/images/bored-ape.png"}
				alt="profile"
			/>
		</section>
	{:else}
		<button
			class="hover:bg-gray outline-gray focus:bg-secondary h-8 w-full p-1 text-left outline-1 transition-all hover:bg-opacity-25 hover:outline"
			class:animate-pulse={authenticating}
			on:click={openGithub}
		>
			login
		</button>
	{/if}
	<hr class="mt-1" />
	<SelectLang />
	<hr />
	<button
		class="hover:bg-gray outline-gray focus:bg-secondary h-8 w-full p-1 text-left outline-1 transition-all hover:bg-opacity-25 hover:outline"
		class:animate-pulse={submittedMessage === "syncing..."}
		on:click={onSubmitLogs}
	>
		submit logs
	</button>
	{#if submittedMessage}
		<p class="text-gray mt-2 text-xs">{submittedMessage}</p>
	{/if}
</nav>

<style>
	hr {
		border: 1px solid #272626;
	}

	#avatar {
		height: 24px !important;
		width: 24px !important;
	}
</style>
