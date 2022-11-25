<!-- home / discover / welcome page -->
<script lang="ts">
    import "$appcss";
    import { backLink } from '$libs/stores';
    import Placeholder from "$components/Placeholder/Placeholder.svelte";
    import PageHeader from "$components/PageHeader/PageHeader.svelte";

    backLink.set('');
</script>


<div>
    <PageHeader>Discover</PageHeader>
    <header>
        <Placeholder label="featured packages"/>
    </header>
    <section class="mt-8">
        <Placeholder label="Getting started with tea"/>
    </section>
</div>

<style>
</style>