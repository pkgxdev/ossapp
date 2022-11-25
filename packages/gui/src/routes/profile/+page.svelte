<script>
    import "$appcss";
    import PageHeader from "$components/PageHeader/PageHeader.svelte";
    import Placeholder from "$components/Placeholder/Placeholder.svelte";
    import { backLink } from '$libs/stores';
    backLink.set('/');
</script>


<div>
    <PageHeader>PROFILE</PageHeader>

    <header>
        <Placeholder label="github username and wallet address"/>
    </header>

    <section class="mt-8 grid grid-cols-2 gap-8">
        <div>
            <Placeholder label="pre-flight"/>
        </div>
        <div>
            <Placeholder label="badges"/>
        </div>
    </section>

    <section class="mt-8">
        <Placeholder label="my installs"/>
    </section>

</div>