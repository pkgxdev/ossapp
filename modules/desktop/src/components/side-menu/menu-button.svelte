<script lang="ts">
	import '$appcss';
  export let icon:string;
  export let label:string;

  export let active = false;

  export let count = 0;
</script>

<button on:click
  class="text-xs w-full flex transition-all rounded-sm hover:bg-opacity-25 border-gray hover:border px-1 gap-2 items-center align-middle text-left hover:bg-gray box-border"
  class:active
>
  <i class="icon-{icon} mt-1"/>
  <div class="font-thin text-sm">
    {label}
    {#if count > 0}
      <span class="text-right rounded-sm">{count}</span>
    {/if}
  </div>
</button>

<style>
  button {
    box-sizing: border-box;
    height: 37px;
  }
  button.active {
    background: rgba(148, 148, 148, 0.5);
    border: rgba(148, 148, 148, 1) 1px solid;
  }
  span {
    color: white;
    background: #FF4100;
    padding: 2px;
    font-size: 10px;
  }
</style>