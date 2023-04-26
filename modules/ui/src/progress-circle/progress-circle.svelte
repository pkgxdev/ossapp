<script lang="ts">
	export let value = 0;
	export let max = 100;
	$: progressPath = () => {
		if (value <= 0) {
			return "";
		} else if (value >= max) {
			return "M50,5A45 45 0 1 1 49.9999 5";
		} else {
			const angle = Math.PI * 2 * (value / max);
			const x = 50 + Math.cos(angle - Math.PI / 2) * 45;
			const y = 50 + Math.sin(angle - Math.PI / 2) * 45;
			let path = "M50,5";
			if (angle > Math.PI) {
				path += "A45 45 0 0 1 50 95";
			}
			path += `A45 45 0 0 1 ${x} ${y}`;
			return path;
		}
	};

	// Format the percentage expressed as 0..100 to a number with 2 decimal places.
	// we never want to round 99.999% to 100% because makes the experience bad so we can't just use toFixed(2) immediately
	const formatPercent = (percent: number) => {
		return (Math.floor(percent * 100) / 100).toFixed(2);
	};
</script>

<div>
	<svg viewBox="0 0 100 100">
		<path d="M50,5A45 45 0 1 1 49.9999 5" />
		<path d={progressPath()} />
	</svg>
	<div>
		<slot>
			<span class="font-mono">{formatPercent(value)}%</span>
		</slot>
	</div>
</div>

<style>
	svg {
		fill: var(--progress-fill, transparent);
		height: 100%;
		position: absolute;
		stroke-linecap: var(--progress-linecap, round);
		width: 100%;
	}
	path:first-child {
		stroke: var(--progress-trackcolor, grey);
		stroke-width: var(--progress-trackwidth, 9px);
	}
	path:last-child {
		stroke: var(--progress-color, #00ffd0);
		stroke-width: var(--progress-width, 10px);
	}
	div {
		height: 100%;
		position: relative;
		width: 100%;
	}
	span {
		left: 50%;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
