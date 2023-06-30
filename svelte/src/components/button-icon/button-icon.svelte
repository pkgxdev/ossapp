<script lang="ts">
  const preventDoubleClick = (evt: MouseEvent) => evt.stopPropagation();
  export let helpText = "";
  export let icon: string;
</script>

<button
  class="border-gray group flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-sm border hover:bg-[#e1e1e1]"
  on:dblclick={preventDoubleClick}
  on:click
  title={helpText}
>
  <div class="icon-{icon} text-l text-gray flex group-hover:text-black" />
</button>
