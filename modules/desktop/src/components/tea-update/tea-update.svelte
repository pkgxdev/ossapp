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

		if (!pkg.installed_versions?.some((version) => version === pkg.version )) {
			return 'update_required';
		}

		return 'up_to_date';
	}

	packagesStore.subscribeToPackage("tea_xyz", (pkg) => {
		const newUpdateState = getCliUpdateState(pkg);
		if (updateState !== 'updated' ) {
			updateState = newUpdateState;
		}
	});

	const onOpenTerminal = async () => {
		console.log("installing tea...")
		try {
			openTerminal(`sh <(curl tea.xyz)`);
		} catch (error) {
			console.log("install failed")
		}
		updateState = 'updated';
	}
</script>

{#if updateState === 'not_installed'}
<div class="banner flex items-center justify-between text-primary">
    {$t('package.install-tea-cli')}
    <Button class="w-16 border-1 text-sm" onClick={onOpenTerminal}>{$t("package.install-label")}</Button>
</div>
{/if}

{#if updateState === 'update_required'}
<div class="banner flex items-center justify-between text-primary">
	{$t('package.update-tea-cli')} 
    <Button class="w-16 border-1 text-sm" onClick={onOpenTerminal}>{$t("package.update-label")}</Button>
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
	}
</style>
