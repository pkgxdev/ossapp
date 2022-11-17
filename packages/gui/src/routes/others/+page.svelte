<script lang="ts">
    import { invoke } from '@tauri-apps/api/tauri'
    let pkg = '';
    async function installPackage(){
        await invoke('install_package', { package: pkg });
    }
</script>

<h1>Others</h1>
<input bind:value={pkg}>
<button on:click={installPackage}>install package</button>
<a href="/">Back</a>