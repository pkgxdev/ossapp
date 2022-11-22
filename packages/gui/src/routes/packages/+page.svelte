<!-- package list -->
<script lang="ts">
    import "$appcss";

    import NavBar from '$components/NavBar/NavBar.svelte';

</script>

<section class="flex">
    <nav>
        <NavBar/>
    </nav>
    <div>
        <h1>Packages Listing</h1>
        <ul>
            <li>
                <a href="/packages/pkg-a">Sample Pkg A</a>
            </li>
            <li>
                <a href="/packages/pkg-b">Sample Pkg B</a>
            </li>
        </ul>
    </div>
</section>