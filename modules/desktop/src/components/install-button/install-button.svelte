<script lang="ts">
	import { PackageStates, type GUIPackage } from "$libs/types";
	import clickOutside from "@tea/ui/lib/clickOutside";
	import PackageStateButton from "./package-state-button.svelte";

	export let buttonSize: "small" | "large" = "small";
	export let pkg: GUIPackage;
	export let availableVersions: string[] = [];

	export let onClick = async (_version: string) => {
		console.log("do nothing");
	};

	$: isOpened = false;

	const toggleOpen = () => {
		if ([PackageStates.INSTALLING, PackageStates.UPDATING].includes(pkg.state)) {
			return;
		}
		isOpened = !isOpened;
	};

	const isInstalled = (version: string) => pkg.installed_versions?.includes(version);

	const handleClick = (version: string) => {
		if (isInstalled(version)) {
			return;
		}

		isOpened = false;
		onClick(version);
	};

	const handleClickOutside = () => (isOpened = false);
</script>

<div class="dropdown z-10" use:clickOutside on:click_outside={handleClickOutside}>
	<PackageStateButton {buttonSize} {pkg} onClick={toggleOpen}>
		<div class="version-list" class:visible={isOpened}>
			{#each availableVersions as version, idx}
				{#if idx !== 0}<hr class="divider" />{/if}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="version-item flex items-center justify-start gap-x-1 text-xs"
					class:installable-version={!isInstalled(version)}
					on:click={() => handleClick(version)}
				>
					<div class:installed-text={isInstalled(version)}>v{version}</div>
					{#if idx === 0}
						<div class="latest-version">(latest)</div>
					{/if}
					{#if isInstalled(version)}
						<div class="flex grow justify-end">
							<i class="installed-text icon-check-circle flex" />
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</PackageStateButton>
</div>

<style>
	.version-list {
		display: none;
		position: absolute;
		margin-top: 6px;
		width: 100%;
		color: white;
		background-color: #1a1a1a;
		border: 0.5px solid #949494;
		box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
		border-radius: 2px;
		max-height: 160px;
		overflow-y: auto;
	}

	.version-item {
		margin: 4px 6px;
		padding: 4px 6px;
		height: auto;
		width: auto;
		white-space: nowrap;
	}

	.installable-version {
		cursor: pointer;
	}

	.installable-version:hover {
		border: 1px solid #949494;
		background-color: rgba(148, 148, 148, 0.35);
	}

	.dropdown {
		position: relative;
		display: inline-block;
		width: 100%;
	}

	.divider {
		border: 1px solid #272626;
		margin-left: 8px;
		margin-right: 8px;
	}

	.installed-text {
		color: #00ffd0;
	}

	.latest-version {
		color: #af5fff;
	}

	.visible {
		display: block;
	}
</style>
