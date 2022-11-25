<script>
    import "$appcss";
    import PageHeader from "$components/PageHeader/PageHeader.svelte";
    import Placeholder from "$components/Placeholder/Placeholder.svelte";
    import { backLink } from '$libs/stores';
    backLink.set('/');
</script>


<div>
    <PageHeader>Packages</PageHeader>
    <section>
        <Placeholder label="filter packages"/>
    </section>
    <ul class="grid grid-cols-3 gap-8 mt-8">
        <li>
            <a href="/packages/pkg-a"><Placeholder label="Pkg A"></Placeholder></a>
        </li>
        <li>
            <a href="/packages/pkg-b"><Placeholder label="Pkg B"></Placeholder></a>
        </li>
        <li>
            <a href="/packages/pkg-c"><Placeholder label="Pkg C"></Placeholder></a>
        </li>
        <li>
            <a href="/packages/pkg-a"><Placeholder label="Pkg D"></Placeholder></a>
        </li>
        <li>
            <a href="/packages/pkg-b"><Placeholder label="Pkg E"></Placeholder></a>
        </li>
        <li>
            <a href="/packages/pkg-c"><Placeholder label="Pkg F"></Placeholder></a>
        </li>
    </ul>
</div>