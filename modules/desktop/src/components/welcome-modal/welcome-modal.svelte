<script lang="ts">
  import Button from "@tea/ui/button/button.svelte";
  import clickOutside from "@tea/ui/lib/clickOutside";

  import { authStore } from "$libs/stores";

  const close = () => {
    authStore.updateSession({ hide_welcome: true });
  };
</script>

<section class="fixed top-0 left-0 z-50 flex items-center justify-center">
  <aside class="relative" use:clickOutside on:click_outside={() => close()}>
    <article class="margin-auto border-gray flex rounded-md border p-2">
      <figure>
        <img class="object-contain" src="/images/welcome-bg.png" alt="welcome" />
      </figure>
      <div class="relative mt-20 flex-grow px-12">
        <h1 class="text-primary mb-4 text-4xl">tea, the open store</h1>
        <p class="font-inter mb-4">
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
      class="icon-tea-x-btn text-gray absolute top-5 right-5"
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
