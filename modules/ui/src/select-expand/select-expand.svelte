<script lang="ts">
	import mouseLeaveDelay from "../lib/mouse-leave-delay";
	export let options: { label: string; value: string; selected?: boolean }[] = [];
	export let label = "";
	export let value = "";

	export let expanded = false;

	const unexpand = () => {
		console.log("unexpand");
		expanded = false;
	};
</script>

<section
	class="cursor-pointer"
	class:expanded
	use:mouseLeaveDelay={3000}
	on:mouseenter={() => (expanded = true)}
	on:leave_delay={() => unexpand()}
>
	<header
		class="mt-2 flex h-8 justify-between rounded-sm px-1 hover:border hover:bg-gray focus:bg-secondary"
	>
		<span>{label || value}</span>
		<i class="icon-downward-arrow mt-1" />
	</header>
	<hr class="mb-2" />
	<div class="dropdown pr-2 transition-all">
		{#each options as option}
			<button
				class="flex h-6 w-full items-center justify-between gap-x-1 rounded-sm px-2 text-xs hover:bg-gray"
				on:click={() => (value = option.value)}
			>
				<div>{option.label}</div>
				{#if option.selected}
					<i class="selected icon-check-circle" />
				{/if}
			</button>
		{/each}
	</div>
</section>

<style>
	hr {
		display: none;
	}
	header {
		line-height: 2em;
	}
	section .dropdown {
		max-height: 0px;
		overflow: hidden;
	}

	section.expanded {
		height: auto;
	}
	section.expanded header {
		margin-bottom: 10px;
	}

	section.expanded hr {
		display: block;
	}
	section.expanded .dropdown {
		max-height: 100px;
		overflow-y: scroll;
		margin-bottom: 10px;
	}

	/* width */
	::-webkit-scrollbar {
		width: 6px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #272626;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #949494;
		border-radius: 4px;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb.expanded {
		background: white;
	}

	.selected {
		color: #00ffd0;
	}
</style>
