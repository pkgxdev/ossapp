<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import Button from '@tea/ui/Button/Button.svelte';
	let pkg = '';
	async function installPackage() {
		await invoke('install_package', { package: pkg });
	}
</script>

<h1>Others</h1>
<input bind:value={pkg} />
<Button on:click={installPackage} label="install package" />
<a href="/">Back</a>
