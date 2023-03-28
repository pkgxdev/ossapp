<script lang="ts">
	import clickOutside from "../lib/clickOutside";
	import Button from "../button/button.svelte";

	export let ctaLabel: string;
	export let ctaType: "ghost" | "plain" = "ghost";
	export let ctaColor: "green" | "secondary" = "secondary";

	export let onClickCTA = async (version: string) => {
		console.log("do nothing");
	};

	export let availableVersions: string[] = [];

	$: isOpened = false;

	const handleClick = (version: string) => {
		isOpened = false;
		onClickCTA(version);
	};

	const handleClickOutside = () => (isOpened = false);
</script>

<div class="dropdown" use:clickOutside on:click_outside={handleClickOutside}>
	<Button
		class="h-8 border border-gray p-2 text-xs"
		type={ctaType}
		color={ctaColor}
		onClick={() => (isOpened = !isOpened)}
	>
		{ctaLabel}
	</Button>
	<div class="version-list" class:visible={isOpened}>
		{#each availableVersions as version, idx}
			{#if idx !== 0}<hr class="divider" />{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="version-item text-xs" on:click={() => handleClick(version)}>
				v{version + (idx === 0 ? " (latest)" : "")}
			</div>
		{/each}
	</div>
</div>

<style>
	.version-list {
		display: none;
		position: absolute;
		margin-top: 4px;
		width: 100%;
		z-index: 1;
		background-color: #1a1a1a;
		border: 0.5px solid #949494;
		box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
		border-radius: 2px;
		max-height: 160px;
		overflow-y: auto;
	}

	.version-item {
		cursor: pointer;
		margin: 4px 6px;
		padding: 4px 6px;
		height: auto;
		width: auto;
		white-space: nowrap;
	}

	.version-item:hover {
		border: 1px solid #949494;
		background-color: rgba(148, 148, 148, 0.35);
	}

	.dropdown {
		position: relative;
		display: inline-block;
		width: 130px;
	}

	.divider {
		border: 1px solid #272626;
		margin-left: 8px;
		margin-right: 8px;
	}

	.visible {
		display: block;
	}
</style>
