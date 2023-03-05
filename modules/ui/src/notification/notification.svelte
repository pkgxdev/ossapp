<script lang="ts">
	import "../app.css";

	// import { NotificationType } from "../types";
	import type { Notification } from "../types";

	export let notification: Notification;

	export let onClose: () => void;
</script>

<div class=" flex w-full items-center justify-between bg-accent px-4 py-2">
	<div class="text-white">{notification.message}</div>
	{#if notification.callback}
		<button
			class="h-10 w-32 bg-white text-accent"
			on:click={() => {
				if (notification.callback) {
					notification.callback();
				}
			}}>{notification.callback_label}</button
		>
	{/if}
	<button class="icon-tea-x-btn" on:click={onClose} />
</div>
