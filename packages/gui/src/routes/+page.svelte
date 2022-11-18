<script lang="ts">
    import "../app.css";
    import { get } from '../libs/api';
    import type { S3Package } from '../libs/types';
    import Button from '../elements/button.svelte';

    let packages: S3Package[] = []
    async function loadPackages(){
        const data = await get<S3Package[]>('/packages');
        console.log(data);
        if (packages) {
            packages = data;
        }
    }
</script>

<a href="/others">Go to install package</a>
<Button  on:click={loadPackages}>Load Packages</Button>
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