<!-- home / discover / welcome page -->
<script lang="ts">
    import "$appcss";
    // import { get } from '../libs/api';
    // import type { S3Package } from '../libs/types';
    import Button from '@tea/ui/Button/Button.svelte';

    import NavBar from '$components/NavBar/NavBar.svelte';

    // let packages: S3Package[] = []
    // async function loadPackages(){
    //     try {
    //         const data = await get<S3Package[]>('/packages');
    //         console.log(data);
    //         if (packages.length) {
    //             packages = data;
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
</script>

<section class="flex">
    <nav>
        <NavBar/>
    </nav>
    <div>
        <h1>Home / Discover</h1>
        <!-- <a href="/others">Go to install package</a>
        <Button primary={true}  on:click={loadPackages} label="Load Packages"></Button>
        <ul>
            {#each packages as p}
                <li>{p.full_name}</li>
            {/each}
        </ul>
        
        <a href="/packages/specific">Go to specific package</a> -->
        <Button primary={true} label="does nothing" />
    </div>
</section>

<style>
    ul {
        color: green;
    }
</style>