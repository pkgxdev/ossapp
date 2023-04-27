<script>
  import Button from "@tea/ui/button/button.svelte";
	import { goto } from "$app/navigation";
  import { SideMenuOptions } from "$libs/types";
</script>

<div class="flex w-full h-3/4 justify-center items-center flex-col">
  <div class="text-2xl text-[#e1e1e1] bg-[#252424] px-9 py-3">
    You don’t have anything installed 
  </div>
  <div class="mt-6 h-6 w-40">
    <Button type="plain" color="blue" onClick={() => goto(`/?tab=${SideMenuOptions.discover}`)}>DISCOVER</Button>
  </div>
</div>
