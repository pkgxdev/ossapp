<script lang="ts">
  import { t, locales, locale } from '$libs/translations'; 
</script>

<section class="flex h-8 mt-1 w-full hover:bg-gray hover:border">
  <select bind:value="{$locale}" class="bg-black hover:bg-gray text-sm text-white flex-grow">
    {#each $locales as value}
      <option value="{value}">{$t(`lang.${value}`)}</option>
    {/each}
  </select>
</section>