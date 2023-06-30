<script lang="ts">
  export let label = "";
</script>

<section class="bg-gray p-8">
  <header>{label}</header>
  <slot />
</section>

<style>
  section {
    position: relative;
    min-height: 240px;
    height: 100%;
    width: 100%;
    min-width: 100%;
    /* background-color: #ccc; */
    display: flex;
  }
  header {
    color: rgb(50, 48, 48);
    font-size: 3em;
  }
</style>
