<script lang="ts">
  import Toggle from "$components/toggle/toggle.svelte";
  import { onMount } from "svelte";

  import { isMagicEnabled, disableMagic, enableMagic } from "@native";

  let checked = false;

  const onChange = (evt: { detail: { checked: boolean } }) => {
    if (evt.detail.checked) {
      enableMagic();
    } else {
      disableMagic();
    }
  };

  onMount(async () => {
    checked = await isMagicEnabled();
  });
</script>

<div class="flex h-7 items-center justify-between p-1">
  <p>magic</p>
  <Toggle leftIcon="one-sparkle" rightIcon="three-sparkles" {checked} on:change={onChange} />
</div>
