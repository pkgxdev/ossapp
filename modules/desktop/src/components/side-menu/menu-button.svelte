<script lang="ts">
  export let icon:string;
  export let label:string;
</script>
<li class="flex gap-2 items-center align-middle">
  <i class={`icon-${icon} text-xs mt-1`}/>
  <div class="font-thin">{label}</div>
</li>