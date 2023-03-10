<script lang="ts">
  import { t, locales, locale } from '$libs/translations'; 
</script>

<section class="flex items-center border border-gray h-8 mt-1 mr-1 px-2 w-full rounded-sm">
  <i class="icon-world text-gray mt-2"></i>
  <select bind:value="{$locale}" class="bg-black text-sm text-gray flex-grow">
    {#each $locales as value}
      <option value="{value}">{$t(`lang.${value}`)}</option>
    {/each}
  </select>
</section>