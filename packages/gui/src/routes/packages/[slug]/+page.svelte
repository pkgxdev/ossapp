<script>
    import "$appcss";

    import NavBar from '$components/NavBar/NavBar.svelte';
    import { page } from '$app/stores';
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<section class="flex">
    <nav>
        <NavBar/>
    </nav>
    <div>
        <h1>{data.title}: {$page.params.slug}</h1>
    </div>
</section>