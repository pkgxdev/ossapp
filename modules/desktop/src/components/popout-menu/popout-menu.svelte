<script lang="ts">
	import { navStore } from "$libs/stores";
	import { submitLogs } from "@native";
	import mouseLeaveDelay from "@tea/ui/lib/mouse-leave-delay";

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
	<button
		class="hover:bg-gray outline-gray focus:bg-secondary h-8 w-full p-1 text-left outline-1 transition-all hover:bg-opacity-25 hover:outline"
	>
		language
	</button>
	<hr />
	<button
		class="hover:bg-gray outline-gray focus:bg-secondary h-8 w-full p-1 text-left outline-1 transition-all hover:bg-opacity-25 hover:outline"
	>
		docs
	</button>
	<hr />
	<button
		class="hover:bg-gray outline-gray focus:bg-secondary h-8 w-full p-1 text-left outline-1 transition-all hover:bg-opacity-25 hover:outline"
	>
		update tea
	</button>
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
</style>
