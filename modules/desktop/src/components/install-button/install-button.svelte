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

	export let uninstall = async () => {
		console.log("do nothing");
	};

	$: isOpened = false;

	const toggleOpen = (evt?: MouseEvent) => {
		evt?.preventDefault();

		if ([PackageStates.INSTALLING, PackageStates.UPDATING].includes(pkg.state)) {
			return;
		}
		isOpened = !isOpened;
	};

	const isInstalled = (version: string) => pkg.installed_versions?.includes(version);

	$: installedVersions = pkg.installed_versions || [];

	const handleClick = (evt: MouseEvent, version: string) => {
		if (isInstalled(version)) {
			return;
		}

		isOpened = false;
		if (version) {
			onClick(version);
		} else {
			uninstall();
		}
	};

	const handleClickOutside = () => (isOpened = false);
</script>

<div class="dropdown z-10" use:clickOutside on:click_outside={handleClickOutside}>
	<PackageStateButton {buttonSize} {pkg} onClick={toggleOpen}>
		<div class="pt-2">
			<div class="version-list" class:visible={isOpened}>
				{#if (pkg?.installed_versions || []).length > 0}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="version-item flex items-center justify-start gap-x-1 text-xs"
						on:click={(evt) => handleClick(evt, "")}
					>
						<div>uninstall</div>
					</div>
					<hr class="divider" />
				{/if}
				{#each availableVersions as version, idx}
					{#if idx !== 0}<hr class="divider" />{/if}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="version-item flex items-center justify-start gap-x-1 text-xs"
						class:installable-version={!installedVersions.includes(version)}
						on:click={(evt) => handleClick(evt, version)}
					>
						<div class:installed-text={installedVersions.includes(version)}>v{version}</div>
						{#if idx === 0}
							<div class="latest-version">(latest)</div>
						{/if}
						{#if installedVersions.includes(version)}
							<div class="flex grow justify-end">
								<i class="installed-text icon-check-circle flex" />
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</PackageStateButton>
</div>

<style>
	.version-list {
		display: none;
		position: absolute;
		width: 100%;
		color: white;
		background-color: #1a1a1a;
		border: 0.5px solid #949494;
		box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
		border-radius: 2px;
		max-height: 160px;
		overflow-y: auto;
		overflow-x: hidden;
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

	/* width */
	::-webkit-scrollbar {
		width: 6px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #272626;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #949494;
		border-radius: 4px;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: white;
	}
</style>
