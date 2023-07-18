<script lang="ts">
  import { t } from "$libs/translations";

  export let isActive: boolean;
  export let onClick: () => void;
  export let label: string;
  export let hidden = false;
</script>

<button class="tabborder w-20 border-x" class:activetab={isActive} class:hidden on:click={onClick}
  >{$t(label)}</button
>

<style>
  .tabborder {
    border-image: linear-gradient(to bottom, rgba(148, 148, 148, 0%), rgba(148, 148, 148, 100%)) 1;
  }

  .activetab {
    color: #00ffd0;
    background: linear-gradient(180deg, rgba(77, 77, 77, 0.7) 0%, rgba(77, 77, 77, 0.35) 100%);
    border-image: linear-gradient(to bottom, rgba(0, 255, 208, 0%), rgba(0, 255, 208, 100%)) 1;
  }
</style>
