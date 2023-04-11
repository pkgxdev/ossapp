<script lang="ts">
	export let width = 0;
</script>

<div class="dark:bg-gray-700 h-2.5 w-full rounded-full bg-gray">
	<div
		class="h-2.5 rounded-full bg-secondary transition-all"
		class:animate-pulse={width < 100 && width > 0}
		class:bg-green={width == 100}
		style="width: {width}%"
	/>
</div>
