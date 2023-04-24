<script lang="ts">
	import ToolTip from "../tool-tip/tool-tip.svelte";

	const preventDoubleClick = (evt: MouseEvent) => evt.stopPropagation();
	export let tooltip = "";
	export let icon: string;
</script>

<button
	class="group flex h-[28px] w-[28px] items-center justify-center rounded-sm border border-gray hover:bg-[#e1e1e1]"
	on:dblclick={preventDoubleClick}
	on:click
>
	{#if tooltip}
		<ToolTip class="ml-[-80px]">
			<div class="icon-{icon} text-l flex text-gray group-hover:text-black" slot="target" />
			<div slot="tooltip-content" class="flex flex-col items-center">
				<div>{tooltip}</div>
			</div>
		</ToolTip>
	{:else}
		<div class="icon-{icon} text-l flex text-gray group-hover:text-black" />
	{/if}
</button>
