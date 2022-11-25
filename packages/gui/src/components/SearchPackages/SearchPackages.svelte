<script>
    import "$appcss";
    import Placeholder from "$components/Placeholder/Placeholder.svelte";
</script>

<div class="bg-black border border-gray">
    <section class="flex">
        <h2>Filter Packages</h2>
        <input type="search" class="text-white bg-black border border-gray"/>
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