<script lang="ts">
	import { PackageStates, type GUIPackage } from "$libs/types";

	export let pkg: GUIPackage;
	export let availableVersions: string[];
</script>

<div class="flex flex-col justify-center">
	{#if pkg.state === PackageStates.AVAILABLE || pkg.state === PackageStates.INSTALLING}
		<div class="pk-version text-xs font-extralight">latest version: v{pkg.version}</div>
		<div class="pk-version text-xs font-extralight">
			versions available: {availableVersions.length}
		</div>
	{:else if pkg.state === PackageStates.NEEDS_UPDATE || pkg.state === PackageStates.UPDATING}
		<div class="pk-version text-xs font-extralight">
			your latest version: v{pkg.installed_versions?.[0]}
		</div>
		<div class="pk-version text-xs font-extralight">update available: v{pkg.version}</div>
	{:else if pkg.state === PackageStates.INSTALLED}
		<div class="pk-version text-xs font-extralight">
			version installed: v{pkg.installed_versions?.[0]}
		</div>
	{/if}
</div>
