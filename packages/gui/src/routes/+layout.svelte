<!-- home / discover / welcome page -->
<script lang="ts">
    import "$appcss";
    import NavBar from '$components/NavBar/NavBar.svelte';

    import { backLink as backLinkStore } from '$libs/stores';

    let backLink: string = '';
    backLinkStore.subscribe((v) => {
        backLink = v;
    });
</script>

<div>
    <nav class="">
        <NavBar/>
    </nav>
    <section class="px-16 pt-24">
        {#if backLink}
            <header>
                <a href={backLink}>back</a>
            </header>
        {/if}
        <figure></figure>
        <slot></slot>
    </section>
</div>

<style>
    div {
        width: 100vh;
        height: 100vh;
    }
    nav {
        position: fixed;
        width: 240px;
    }
    section {
        position: fixed;
        left: 240px;
        right: 0px;
        height: 100vh;
        overflow-y: scroll;
    }
    figure {
        position: absolute;
        top: 180px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-image: url('/images/footer-grid-element.svg');
    }
    header {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 50px;
        border-bottom: #CCC 1px solid;
    }
</style>