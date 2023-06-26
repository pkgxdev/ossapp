<script lang="ts">
  import type { GUIPackage } from "$libs/types";
  import { openPackageEntrypointInTerminal } from "@native";
  import Button from "@tea/ui/button/button.svelte";
  import { t } from "$libs/translations";

  export let pkg: GUIPackage;
  export let buttonSize: "small" | "large" = "small";
</script>

<Button
  class={buttonSize === "small" ? "h-8 text-xs" : "h-10"}
  type="plain"
  color="black"
  onClick={(evt) => {
    evt?.preventDefault();
    openPackageEntrypointInTerminal(pkg);
  }}
>
  {#if !!pkg.entrypoint}
    {$t("package.open").toUpperCase()}
  {:else}
    {$t("package.open-in-terminal").toUpperCase()}
  {/if}
</Button>
