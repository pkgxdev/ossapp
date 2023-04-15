<script lang="ts">
	import "$appcss";
	export let icon: string;
	export let label: string;

	export let active = false;

	export let count = 0;
</script>

<button
	on:click
	class="outline-gray hover:bg-gray box-border flex w-full items-center gap-2 rounded-sm px-1 text-left align-middle text-xs outline-1 transition-all hover:bg-opacity-25 hover:outline"
	class:active
>
	<i class="icon-{icon} mt-1" />
	<div class="text-sm font-thin">
		{label}
		{#if count > 0}
			<span class="rounded-sm text-right">{count}</span>
		{/if}
	</div>
</button>

<style>
	button {
		box-sizing: border-box;
		height: 37px;
	}
	button.active {
		background: rgba(148, 148, 148, 0.5);
		border: rgba(148, 148, 148, 1) 1px solid;
	}
	span {
		color: white;
		background: #ff4100;
		padding: 2px;
		font-size: 10px;
	}
</style>
