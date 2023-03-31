<script lang="ts">
	import { PackageStates, type GUIPackage } from "$libs/types";
	import Button from "@tea/ui/button/button.svelte";
	import { t } from "$libs/translations";

	export let buttonSize: "small" | "large" = "small";

	export let pkg: GUIPackage;
	export let onClick = () => {
		console.log("do nothing");
	};

	const getColor = (state: PackageStates): "primary" | "secondary" | "black" => {
		if (state === PackageStates.INSTALLED) {
			return "black";
		}
		if (state === PackageStates.AVAILABLE || state === PackageStates.INSTALLING) {
			return "secondary";
		}
		return "primary";
	};

	$: ctaLabel = $t(`package.cta-${pkg.state}`);
</script>

<Button
	class={`w-full border text-xs text-white ${buttonSize === "small" ? "h-8" : "h-10"}`}
	type="plain"
	color={getColor(pkg.state)}
	{onClick}
>
	{#if pkg.state === PackageStates.INSTALLED}
		<div class="flex items-center justify-center">
			<i class="icon-check-circle mr-2 flex" />
			<span>{ctaLabel}</span>
		</div>
	{:else if pkg.state === PackageStates.AVAILABLE || pkg.state === PackageStates.INSTALLING}
		<div class="flex items-center justify-between">
			<span class="ml-1">{ctaLabel}</span>
			<i class="icon-downward-arrow mr-1 flex" />
		</div>
	{:else}
		<div class="flex items-center justify-center">
			{ctaLabel}
		</div>
	{/if}
</Button>
