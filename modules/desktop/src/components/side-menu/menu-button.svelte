<script lang="ts">
	import '$appcss';
  export let icon:string;
  export let label:string;

  export let active = false;
</script>

<button on:click class={`text-xs w-full flex transition-all rounded-sm hover:bg-opacity-25 border-gray hover:border p-2 gap-2 items-center align-middle text-left hover:bg-gray box-border ${active && 'active'}`}>
  <i class={`icon-${icon} mt-1`}/>
  <div class="font-thin text-sm">{label}</div>
</button>

<style>
  button {
    box-sizing: border-box;
    height: 37px;
    cursor: auto;
  }
  button.active {
    background: rgba(148, 148, 148, 0.5);
    border: rgba(148, 148, 148, 1) 1px solid;
  }
</style>