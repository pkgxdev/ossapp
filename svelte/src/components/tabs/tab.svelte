<script lang="ts">
  import { t } from "$libs/translations";

  export let isActive: boolean;
  export let onClick: () => void;
  export let label: string;
  export let isDisabled = false;
</script>

<button
  class="tab w-20 border-x"
  class:activetab={isActive}
  disabled={isDisabled}
  on:click={onClick}>{$t(label)}</button
>

<style>
  .tab {
    border-image: linear-gradient(to bottom, rgba(148, 148, 148, 0%), rgba(148, 148, 148, 100%)) 1;
    background: linear-gradient(180deg, rgba(77, 77, 77, 0.7) 0%, rgba(77, 77, 77, 0.35) 100%);
  }

  .activetab {
    color: #00ffd0;
    background: linear-gradient(180deg, rgba(77, 77, 77, 0.7) 0%, rgba(77, 77, 77, 0.35) 100%);
    border-image: linear-gradient(to bottom, rgba(0, 255, 208, 0%), rgba(0, 255, 208, 100%)) 1;
  }

  .tab:disabled {
    background: none;
    background-color: #1a1a1a;
  }
</style>
