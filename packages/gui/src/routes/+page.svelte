<script lang="ts">
    import { get } from '../libs/api';
    import type { S3Package } from '../libs/types';

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
<button on:click={loadPackages}>Load Packages</button>
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