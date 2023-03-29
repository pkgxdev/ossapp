<script lang="ts">
	import { PackageStates, type GUIPackage } from "$libs/types";
	import Button from "@tea/ui/button/button.svelte";
	import { t } from "$libs/translations";

	export let pkg: GUIPackage;
	export let onClick = () => {
		console.log("do nothing");
	};

	const getLabel = (state: PackageStates): string => {
		return {
			[PackageStates.AVAILABLE]: $t("package.install-label").toUpperCase(),
			[PackageStates.INSTALLED]: $t("package.installed-label").toUpperCase(),
			[PackageStates.INSTALLING]: $t("package.installing-label").toUpperCase(),
			[PackageStates.UNINSTALLED]: $t("package.reinstall-label").toUpperCase(),
			[PackageStates.NEEDS_UPDATE]: $t("package.needs-update-label").toUpperCase(),
			[PackageStates.UPDATING]: $t("package.needs-update-label").toUpperCase()
		}[state];
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
</script>

<Button
	class="h-8 w-full border text-xs text-white "
	type="plain"
	color={getColor(pkg.state)}
	{onClick}
>
	{#if pkg.state === PackageStates.INSTALLED}
		<div class="flex items-center justify-center">
			<i class="icon-check-circle mr-2 flex" />
			<span>{getLabel(pkg.state)}</span>
		</div>
	{:else if pkg.state === PackageStates.AVAILABLE || pkg.state === PackageStates.INSTALLING}
		<div class="flex items-center justify-between">
			<span class="ml-1">{getLabel(pkg.state)}</span>
			<i class="icon-downward-arrow mr-1 flex" />
		</div>
	{:else}
		<div class="flex items-center justify-center">
			{getLabel(pkg.state)}
		</div>
	{/if}
</Button>
