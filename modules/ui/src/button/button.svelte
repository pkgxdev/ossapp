<script lang="ts">
	let clazz = "";
	export { clazz as class };

	// export let size: 'large' | 'medium' | 'small' = 'medium';

	export let onClick: undefined | (() => void) = undefined;
	export let active = false;

	export let type: "outline" | "ghost" | "plain" = "ghost";
	export let color: "primary" | "secondary" | "green" | "black" = "primary";

	export let loading = false;
</script>

<div class="button-container">
	<button
		type="button"
		class={`w-full p-2 text-gray ${clazz} ${active ? "active" : ""} ${type} ${color} ${
			loading ? "animate-pulse" : ""
		}`}
		on:click={() => onClick && onClick()}
	>
		<slot />
	</button>
</div>

<style>
	.button-container {
		position: relative;
	}

	/* pseudo element for hover effect - width will transition on hover */
	button::before {
		position: absolute;
		content: "";
		transition-duration: 0.2s;
		z-index: -1;
		inset: 0px auto auto 0px;
		width: 0px;
		height: 100%;
		opacity: 1;
	}

	button:hover::before {
		width: 100%;
		height: 100%;
		opacity: 1;
	}

	button {
		z-index: 0;
		min-width: 100px;
		position: relative;
	}

	button:hover {
		transition: color 0.3s ease 0s, background 0s ease 0.3s;
	}

	/* primary */
	button.plain.primary {
		background: #00ffd0;
		border: 1px solid #00ffd0;
		color: black;
	}

	button.plain.primary.active {
		background: #01997d;
	}

	button.primary::before {
		background: #0ecaa7;
	}

	/* secondary */
	button.plain.secondary {
		background: #8000ff;
		border: 1px solid #8000ff;
		color: white;
	}

	button.plain.secondary.active {
		background: #410182;
	}

	button.secondary::before {
		background: #6000bf;
	}

	/* green */
	button.plain.green {
		background: #00a517;
		color: white;
	}

	button.green::before {
		background: #8000ff;
	}

	/* black */
	button.plain.black {
		background: #1a1a1a;
		color: white;
		border: 1px solid white;
	}

	button.black::before {
		background: #e1e1e1;
	}

	/* black button inverts colors on hover */
	button.black:hover {
		color: #1a1a1a;
		background: #e1e1e1;
	}
</style>
