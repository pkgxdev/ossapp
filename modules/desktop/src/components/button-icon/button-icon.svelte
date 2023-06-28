<script lang="ts">
  const preventDoubleClick = (evt: MouseEvent) => evt.stopPropagation();
  export let helpText = "";
  export let icon: string;
</script>

<button
  class="group flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-sm border border-gray hover:bg-[#e1e1e1]"
  on:dblclick={preventDoubleClick}
  on:click
  title={helpText}
>
  <div class="icon-{icon} text-l flex text-gray group-hover:text-black" />
</button>
