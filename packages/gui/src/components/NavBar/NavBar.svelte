<script type="ts">
    import { open } from '@tauri-apps/api/shell';
    const openGithub = () => {
        open('https://github.com/teaxyz')
    }
</script>

<ul id="NavBar" class="bg-primary">
    <li>
        <a href="/">Home / Tea Icon</a>
    </li>
    <li>
        <input type="search" placeholder="search" />
    </li>
    <li>
        <a href="/">Discover</a>
    </li>
    <li>
        <a href="/documentation">Documentation</a>
    </li>
    <li>
        <a href="/cli">TEA CLI INSTALL</a>
    </li>
    <li>
        <a href="/packages">PACKAGES</a>
    </li>
    <li>
        <button on:click={openGithub}>view on github</button>
    </li>
    <li>
        <a href="/profile">user profile</a>
    </li>
</ul>

<style>
    #NavBar {
        height: 100vh;
    }
</style>