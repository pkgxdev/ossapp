<script>
    import "$appcss";
    import PageHeader from "$components/PageHeader/PageHeader.svelte";
    import Placeholder from "$components/Placeholder/Placeholder.svelte";
    import { backLink } from '$libs/stores';
    backLink.set('/');
</script>


<div>
    <PageHeader>INSTALL TEA</PageHeader>

    <header>
        <Placeholder label="big tea icon version with copy curl"/>
    </header>

    <section class="mt-8">
        <Placeholder label="big black blank space"/>
    </section>
</div>