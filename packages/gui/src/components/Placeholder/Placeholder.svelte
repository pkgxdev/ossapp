<script type="ts">
    export let label:string = "";
</script>

<section>
    <header>{label}</header>
</section>

<style>
    section {
        position: relative;
        min-height: 240px;
        height: 100%;
        width: 100%;
        min-width: 100%;
        background-color: #CCC;
        display: flex;
    }
    header {
        color: rgb(50, 48, 48);
        font-size: 3em;
    }
</style>