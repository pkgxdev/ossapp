<script lang="ts">
  import { t, locales, locale } from "$libs/translations";
  import { shellOpenExternal } from "@native";
  const label = "language";
  export let value = "";

  export let expanded = false;

  $: options = $locales.map((value) => ({
    label: $t(`lang.${value}`),
    value,
    selected: value === $locale
  }));

  const openLangugeContributionPage = () => {
    shellOpenExternal("https://github.com/orgs/teaxyz/discussions/618");
  };
</script>

<section
  class="cursor-pointer bg-black"
  class:expanded
  on:mouseenter={() => (expanded = true)}
  on:mouseleave={() => (expanded = false)}
>
  <header
    class="focus:bg-secondary mt-1 flex h-8 items-center justify-between px-1 outline-1 hover:bg-opacity-25"
  >
    <span>{label || value}</span>
    <i class="icon-downward-arrow mt-1" />
  </header>
  <div class="dropdown w-full bg-black transition-all">
    {#each options as option}
      <button
        class="outline-gray hover:bg-gray flex h-6 w-full items-center justify-between gap-x-1 px-2 text-xs outline-1 hover:bg-opacity-25 hover:outline"
        on:click={() => {
          value = option.value;
          locale.set(option.value);
        }}
      >
        <div>{option.label}</div>
        {#if option.selected}
          <i class="selected icon-check-circle" />
        {/if}
      </button>
    {/each}

    <button
      on:click={openLangugeContributionPage}
      class="outline-gray hover:bg-gray flex h-6 w-full items-center gap-x-1 px-2 text-xs outline-1 hover:bg-opacity-25 hover:outline"
    >
      <i class="icon-github" /> <span>Contribute</span>
    </button>
  </div>
</section>

<style>
  header {
    line-height: 2em;
  }
  section .dropdown {
    max-height: 0px;
    overflow: hidden;
  }

  section.expanded {
    height: auto;
  }
  section.expanded header {
    margin-bottom: 10px;
  }

  section.expanded .dropdown {
    max-height: 100px;
    overflow-y: auto;
    margin-bottom: 10px;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #272626;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #949494;
    border-radius: 4px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb.expanded {
    background: white;
  }

  .selected {
    color: #00ffd0;
  }
</style>
