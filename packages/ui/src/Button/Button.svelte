<script type="ts">
	let clazz: string = '';
	export { clazz as class };

	export let size: 'large' | 'medium' | 'small' = 'medium';

	export let onClick: () => void;
</script>

<button
	type="button font-sans"
	class={`p-2 font-machina bg-black text-gray ${clazz}`}
	id="liveToastBtn"
	on:click={() => onClick && onClick()}
>
	<slot />
</button>

<style>
	button {
		min-width: 100px;
		transition: 0.2s ease-in-out !important;
	}
	button:hover {
		box-shadow: inset 0px 0px 0px 5px #1a1a1a !important;
		background-color: #00ffd0 !important;
		color: #1a1a1a !important;
	}
</style>
