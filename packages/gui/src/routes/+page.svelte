<script lang="ts">
    import "../app.css";
    import { get } from '../libs/api';
    import type { S3Package } from '../libs/types';
    import Button from '@tea/ui/Button/Button.svelte';

    let packages: S3Package[] = []
    async function loadPackages(){
        try {
            const data = await get<S3Package[]>('/packages');
            console.log(data);
            if (packages.length) {
                packages = data;
            }
        } catch (error) {
            console.error(error);
        }
    }
</script>

<a href="/others">Go to install package</a>
<Button primary={true}  on:click={loadPackages} label="Load Packages"></Button>
<ul>
    {#each packages as p}
        <li>{p.full_name}</li>
    {/each}
</ul>

<style>
    ul {
        color: green;
    }
</style>