<script lang="ts">
  import { t, locales, locale } from '$libs/translations'; 
</script>

<select bind:value="{$locale}" class="bg-black text-sm text-gray">
  {#each $locales as value}
    <option value="{value}">{$t(`lang.${value}`)}</option>
  {/each}
</select>