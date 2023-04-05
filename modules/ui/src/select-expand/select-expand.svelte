<script lang="ts">
	export let options: { label: string; value: string; selected?: boolean }[] = [];
	export let label = "";
	export let value = "";
</script>

<section class="cursor-pointer">
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

	section:hover {
		height: auto;
	}
	section:hover header {
		margin-bottom: 10px;
	}

	section:hover hr {
		display: block;
	}
	section:hover .dropdown {
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
	::-webkit-scrollbar-thumb:hover {
		background: white;
	}

	.selected {
		color: #00ffd0;
	}
</style>
