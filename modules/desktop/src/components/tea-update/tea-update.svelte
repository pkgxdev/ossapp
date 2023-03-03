<script lang="ts">
	import { t } from '$libs/translations'; 
	import Button from '@tea/ui/button/button.svelte';
	import { openTerminal } from '@native';
	import { packagesStore } from '$libs/stores';
  import { PackageStates, type GUIPackage } from '$libs/types';

	type CliUpdateState = 'unknown' | 'not_installed' | 'update_required' | 'up_to_date' | 'updated';
	
	$: updateState = 'unknown' as CliUpdateState;

	const getCliUpdateState = (pkg: GUIPackage | null): CliUpdateState => {
		if (!pkg) {
			return 'unknown';
		}

		if (pkg.state != PackageStates.INSTALLED){ 
			return 'not_installed';
		}

		if (!pkg.installed_versions?.includes(pkg.version)) {
			return 'update_required';
		}

		return 'up_to_date';
	}

	packagesStore.subscribeToPackage("tea_xyz", (pkg) => {
		if (updateState !== 'updated' ) {
			updateState = getCliUpdateState(pkg);
		}
	});

	const onOpenTerminal = async () => {
		console.log("installing tea...")
		try {
			openTerminal(`sh <(curl https://tea.xyz)`);
		} catch (error) {
			console.log("install failed")
		}
		updateState = 'updated';
	}
</script>

{#if updateState === 'not_installed'}
<div class="banner flex items-center justify-center text-primary">
    <span class="text-white mr-4">{$t('package.install-tea-cli')}</span>
	<button class="button" on:click={onOpenTerminal}>{$t("package.install-tea-label")}</button>
</div>
{/if}

{#if updateState === 'update_required'}
<div class="banner flex items-center justify-center text-primary">
	<span class="text-white mr-4">{$t('package.update-tea-cli')}</span>
    <button class="button" on:click={onOpenTerminal}>{$t("package.update-tea-label")}</button>
</div>
{/if}

<style>
	.banner {
		background-color: #FF4100;
		margin-bottom: 16px;
		border-radius: 4px;
		padding: 6px;
		z-index: 1;
		position: relative;
		padding-top: 12px;
		padding-bottom: 12px;
	}

	.button {
		color: white;
		border: 1px solid white;
		padding: 6px 24px;
		position: relative;
	}

	.button::before {
		position: absolute;
		content: "";
		background: #e1e1e1;
		transition-duration: 0.2s;
		z-index: -1;
		inset: 0px auto auto 0px;
		width: 0px;
		height: 100%;
		opacity: 1;
	}

	.button:hover::before {
		width: 100%;
		height: 100%;
		opacity: 1;
	}

	.button:hover {
		color: #1a1a1a;
		background: #e1e1e1;
		transition: color 0.3s ease 0s, background 0s ease 0.3s;
	}
</style>
