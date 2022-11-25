<!-- home / discover / welcome page -->
<script lang="ts">
    import "$appcss";
    import NavBar from '$components/NavBar/NavBar.svelte';
</script>

<div class="flex">
    <nav>
        <NavBar/>
    </nav>
    <section class="grow p-16">
        <figure></figure>
        <slot></slot>
    </section>
</div>

<style>
    section {
        position: relative;
    }
    figure {
        position: absolute;
        top: 180px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-image: url('/images/footer-grid-element.svg');
    }
</style>