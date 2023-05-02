<script lang="ts">
  import { t } from "$libs/translations";
  import Button from "@tea/ui/button/button.svelte";
  import * as pub from "$env/static/public";
</script>

<footer class="relative h-auto w-full bg-black">
  <section class="p-4 px-16 py-16">
    <h3 class="mb-5 text-2xl text-primary">{$t("footer.quick-links-title").toUpperCase()}</h3>
    <menu class="flex gap-4">
      <div class="flex-grow border border-l-0 border-r-0 border-gray">
        <a href="/">
          <Button>
            <div class="flex justify-between text-primary hover:text-black">
              <div class="uppercase">{$t("footer.about-tea-store").toUpperCase()}</div>
              <div>&#8594</div>
            </div>
          </Button>
        </a>
      </div>
      <div class="flex-grow border border-l-0 border-r-0 border-gray">
        <a href="/">
          <Button>
            <div class="flex justify-between text-primary hover:text-black">
              <div class="uppercase">{$t("footer.report-a-problem").toUpperCase()}</div>
              <div>&#8594</div>
            </div>
          </Button>
        </a>
      </div>
      <div class="flex-grow border border-l-0 border-r-0 border-gray">
        <a href="https://tea.xyz" target="_blank" rel="noreferrer">
          <Button>
            <div class="flex justify-between text-primary hover:text-black">
              <div class="uppercase">{$t("footer.visit-website").toUpperCase()}</div>
              <div>&#8594</div>
            </div>
          </Button>
        </a>
      </div>
    </menu>
  </section>

  <section class="flex h-16 justify-between border border-r-0 border-gray p-4 px-16">
    <div class="flex gap-4 text-xs text-gray">
      <a
        href="https://tea.xyz/terms-of-use/"
        target="_blank"
        rel="noreferrer"
        class="hover:text-white"
      >
        {$t("footer.terms-services").toUpperCase()}
      </a>
      <a
        href="https://tea.xyz/privacy-policy/"
        target="_blank"
        rel="noreferrer"
        class="hover:text-white"
      >
        {$t("footer.privacy-policy").toUpperCase()}
      </a>
    </div>
    {#if pub.PUBLIC_VERSION}
      <div class="flex gap-4 text-xs text-gray">
        <span>v{pub.PUBLIC_VERSION}</span>
      </div>
    {/if}
  </section>
</footer>

<style>
  h3 {
    color: #00ffd0;
  }
</style>
