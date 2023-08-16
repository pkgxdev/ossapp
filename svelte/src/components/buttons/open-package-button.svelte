<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { GUIPackage } from "$libs/types";
  import { openPackageEntrypointInTerminal } from "@native";
  import Button from "$components/button/button.svelte";
  import { t } from "$libs/translations";
  export let pkg: GUIPackage;
  export let buttonSize: "small" | "large" = "small";

  const dispatch = createEventDispatcher();
</script>

<Button
  data-testid="open-{pkg.slug}"
  class={buttonSize === "small" ? "h-8 text-xs" : "h-10"}
  type="plain"
  color="black"
  onClick={(evt) => {
    evt?.preventDefault();
    openPackageEntrypointInTerminal(pkg);
    dispatch("openterminal");
  }}
>
  {#if !!pkg.entrypoint}
    {$t("package.open").toUpperCase()}
  {:else}
    {$t("package.open-in-terminal").toUpperCase()}
  {/if}
</Button>
