<script lang="ts">
  import Button from "@tea/ui/button/button.svelte";
  import { shellOpenExternal } from "@native";
</script>

<div class="flex flex-col justify-center items-center h-full">
  <div class="text-2xl">Hmm, we don't have that one yet...</div>
  <div class="text-xl mt-4">But we'd love for you to submit it to the pantry!</div>
  <div class="mt-10">
    <Button type="plain" color="blue" onClick={() => shellOpenExternal("https://github.com/teaxyz/pantry")}>
      <span class="text-sm px-12">VISIT PANTRY</span>
    </Button>
  </div>
  <div class="text-gray text-xs mt-2">Redirects to github</div>
</div>
