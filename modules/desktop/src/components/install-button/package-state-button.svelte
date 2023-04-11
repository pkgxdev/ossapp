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

	const badgeClass: Record<PackageStates, string> = {
		[PackageStates.AVAILABLE]: "install-badge",
		[PackageStates.INSTALLING]: "install-badge",
		[PackageStates.NEEDS_UPDATE]: "update-badge",
		[PackageStates.UPDATING]: "update-badge",
		[PackageStates.INSTALLED]: "installed-badge",
		[PackageStates.UNINSTALLED]: ""
	};

	$: ctaLabel = $t(`package.cta-${pkg.state}`);
</script>

<Button
	class="w-full border p-0 text-xs text-white {buttonSize === 'small' ? 'h-8' : 'h-10'}"
	type="plain"
	color={getColor(pkg.state)}
	{onClick}
>
	<div class="version-button">
		<div class="flex h-full flex-col justify-center p-2">
			{#if pkg.state === PackageStates.AVAILABLE}
				<div class="flex items-center justify-between gap-x-2">
					<div class="flex items-center gap-x-2">
						<div>{ctaLabel}</div>
						<div class="version-label install-badge">{pkg.version}</div>
					</div>
					<i class="icon-downward-arrow flex" />
				</div>
			{:else if pkg.state === PackageStates.NEEDS_UPDATE || pkg.state === PackageStates.INSTALLED}
				<div class="flex items-center justify-center gap-x-2">
					<div>{ctaLabel}</div>
					<div class="version-label {badgeClass[pkg.state]}">{pkg.version}</div>
				</div>
			{:else}
				<div class="flex items-center justify-center">
					{ctaLabel}
				</div>
			{/if}
		</div>
		<!-- This slot holds the drop down menu and it inside of the button so that the 
		hover effect remain on the button while the user is hovering the dropdown items-->
		<slot />
	</div>
</Button>

<style>
	.version-label {
		font-size: 10px;
		line-height: 12px;
		padding: 0 4px;
		border-radius: 2px;
	}

	.install-badge {
		background-color: #dcb8ff;
		color: #8000ff;
	}

	.update-badge {
		background-color: #04957a;
		color: #00ffd0;
	}

	.installed-badge {
		background-color: white;
		color: #1a1a1a;
	}

	.version-button:hover .install-badge {
		background-color: white;
	}

	.version-button:hover .update-badge {
		background-color: #1a1a1a;
	}

	.version-button:hover .installed-badge {
		background-color: #1a1a1a;
		color: white;
	}
</style>
