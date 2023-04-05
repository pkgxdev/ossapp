<script lang="ts">
  import { t, locales, locale } from '$libs/translations'; 
  import SelectExpand from "@tea/ui/select-expand/select-expand.svelte";

  const label = "Language";
</script>

<SelectExpand
  {label}
  bind:value={$locale}
  options={$locales.map((value) => ({
    label: $t(`lang.${value}`),
    value,
    selected: value === $locale,
  }))}
/>