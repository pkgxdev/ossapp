<script lang="ts">
  import Button from "@tea/ui/button/button.svelte";
  import clickOutside from "@tea/ui/lib/clickOutside";

  import { authStore } from "$libs/stores";

  const close = () => {
    authStore.updateSession({ hide_welcome: true });
  };
</script>

<section class="fixed left-0 top-0 z-50 flex items-center justify-center">
  <aside class="relative" use:clickOutside on:click_outside={() => close()}>
    <article class="margin-auto flex rounded-md border border-gray p-2">
      <figure>
        <img class="object-contain" src="/images/welcome-bg.png" alt="welcome" />
      </figure>
      <div class="relative mt-20 flex-grow px-12">
        <h1 class="mb-4 text-4xl text-primary">tea, the open store</h1>
        <p class="mb-4 font-inter">
          tea is your gateway to the vibrant world of open-source software; a treasure-trove of
          apps, frameworks, libraries, tools, utilities and games. previously only accessible to the
          tech-savvy, tea unleashes the power of open source for everyone. install packages, get
          updates and stay secure—all in the click of a button. under the hood is the invisible yet
          powerful tea/cli.
        </p>

        <Button type="plain" color="secondary" class="w-7/12" onClick={() => close()}>
          START EXPLORING
        </Button>
      </div>
    </article>

    <button
      class="icon-tea-x-btn absolute right-5 top-5 text-gray"
      on:click={() => {
        close();
      }}
    />
  </aside>
</section>

<style>
  section {
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  }

  article {
    height: 472px;
    width: 725px;
    background: rgba(0, 0, 0, 0.8);
  }

  figure {
    min-width: 140px;
  }
  img {
    height: 100%;
  }
</style>
