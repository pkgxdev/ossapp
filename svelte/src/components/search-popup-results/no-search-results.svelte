<script lang="ts">
  import Button from "$components/button/button.svelte";
  import { shellOpenExternal } from "@native";
</script>

<div class="flex h-full flex-col items-center justify-center">
  <div class="text-2xl">Hmm, we don't have that one yet...</div>
  <div class="mt-4 text-xl">But we'd love for you to submit it to the pantry!</div>
  <div class="mt-10">
    <Button
      type="plain"
      color="blue"
      onClick={() => shellOpenExternal("https://github.com/pkgxdev/pantry")}
    >
      <span class="px-12 text-sm">VISIT PANTRY</span>
    </Button>
  </div>
  <div class="text-gray mt-2 text-xs">Redirects to github</div>
</div>
