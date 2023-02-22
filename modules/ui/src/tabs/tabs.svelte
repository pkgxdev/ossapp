<script lang="ts">
	import type { Tab } from "../types";
	import { afterUpdate } from "svelte";

	let clazz = "";

	export { clazz as class };

	import Button from "../button/button.svelte";

	export let tabs: Tab[] = [];

	let active: string;

	afterUpdate(() => {
		if (tabs.length && !active) {
			active = tabs[0].label;
		}
	});
</script>

<section class={`relative h-auto border border-gray ${clazz || ""}`}>
	<menu class="flex border border-gray">
		{#each tabs as tab}
			<div class="border border-y-0 border-l-0 border-gray text-white">
				<Button onClick={() => (active = tab.label)}>
					<span class={tab.label === active ? "text-white" : ""}>{tab.label}</span>
				</Button>
			</div>
		{/each}
	</menu>

	{#each tabs as tab}
		{#if tab.label === active}
			<svelte:component this={tab.component} {...tab.props} />
		{/if}
	{/each}
</section>
