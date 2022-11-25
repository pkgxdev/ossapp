<script>
    import "$appcss";
    import PageHeader from "$components/PageHeader/PageHeader.svelte";
    import Placeholder from "$components/Placeholder/Placeholder.svelte";
    import { backLink } from '$libs/stores';
    backLink.set('/');
</script>


<div>
    <PageHeader>Documentation</PageHeader>

    <header>
        <Placeholder label="featured courses"/>
    </header>

    <section class="mt-8">
        <Placeholder label="Essential workshops"/>
    </section>
</div>