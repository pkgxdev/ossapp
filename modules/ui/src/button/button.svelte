<script lang="ts">
	let clazz = "";
	export { clazz as class };

	// export let size: 'large' | 'medium' | 'small' = 'medium';

	export let onClick: undefined | (() => void) = undefined;
	export let active = false;

	export let type: "ghost" | "plain" = "ghost";
	export let color: "primary" | "secondary" = "primary";

	export let loading = false;
</script>

<button
	type="button"
	class={`w-full p-2 font-machina text-gray ${clazz} ${active ? "active" : ""} ${type} ${color} ${
		loading ? "animate-pulse" : ""
	}`}
	on:click={() => onClick && onClick()}
>
	<slot />
</button>

<style>
	button {
		min-width: 100px;
		transition: 0.2s ease-in-out;
	}

	button.plain.primary {
		color: black;
		background-color: #00ffd0;
	}

	button.plain.secondary {
		color: white;
		background-color: #8000ff;
	}
	button.active {
		color: black;
	}
	button:hover {
		box-shadow: inset 0px 0px 0px 5px #1a1a1a;
		background-color: #00ffd0;
		color: #1a1a1a;
	}
	button.primary:hover {
		background-color: #00ffd0;
	}
	button.secondary:hover {
		background-color: #8000ff;
	}
</style>
