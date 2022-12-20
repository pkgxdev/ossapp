<script lang="ts">
	let clazz = '';
	export { clazz as class };

	// export let size: 'large' | 'medium' | 'small' = 'medium';

	export let onClick: undefined | (() => void) = undefined;
	export let active = false;
</script>

<button
	type="button font-sans"
	class={`w-full p-2 font-machina text-gray ${clazz} ${active ? 'active' : ''}`}
	on:click={() => onClick && onClick()}
>
	<slot />
</button>

<style>
	button {
		min-width: 100px;
		transition: 0.2s ease-in-out !important;
	}
	button.active {
		color: black;
	}
	button:hover {
		box-shadow: inset 0px 0px 0px 5px #1a1a1a !important;
		background-color: #00ffd0 !important;
		color: #1a1a1a !important;
	}
</style>
