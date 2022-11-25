<script>
    import "$appcss";
    import PageHeader from "$components/PageHeader/PageHeader.svelte";
    import Placeholder from "$components/Placeholder/Placeholder.svelte";
    import { page } from '$app/stores';
    import { backLink } from '$libs/stores';
    backLink.set('/packages');

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div>
    <PageHeader>{data.title}</PageHeader>
    <section>
        <Placeholder label="package cover w/ copy link" />
    </section>
    <section class="mt-8">
        <Placeholder label="reviews" />
    </section>
</div>