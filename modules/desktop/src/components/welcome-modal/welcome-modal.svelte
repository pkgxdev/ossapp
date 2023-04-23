<script lang="ts">
  import Button from "@tea/ui/button/button.svelte";
	import clickOutside from "@tea/ui/lib/clickOutside";

  import { authStore } from "$libs/stores"

  const close = () => {
    authStore.updateSession({ hide_welcome: true });
  }
</script>

<section class="fixed z-50 top-0 left-0 flex items-center justify-center">
  <aside class="relative" use:clickOutside on:click_outside={() => close()}>
    <article class="flex margin-auto p-2 border border-gray rounded-md">
      <figure>
        <img  class="object-contain" src="/images/welcome-bg.png" alt="welcome"/>
      </figure>
      <div class="flex-grow mt-20 px-12 relative">
        <h1 class="text-primary text-4xl mb-4">Welcome to the tea app!</h1>
        <p class="font-inter mb-4">This app is your gateway into the world of open-source software. Easily explore and manage packages with a click of a button. This app will notify you of any available software updates to ensure you’re safe and secure. Under the hood is the powerful tea cli.</p>

        <Button type="plain" color="secondary" class="w-7/12"
          onClick={() => close()}
        >
          EXPLORE OPEN-SOURCE
        </Button>
      </div>
    </article>

    <button class="icon-tea-x-btn absolute text-gray top-5 right-5"
      on:click={() => {
        close()
      }}
    ></button>
  </aside>
</section>

<style>
  section {
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0, 0.5);
  }

  article {
    height: 472px;
    width: 725px;
    background: rgba(0,0,0, 0.8);
  }

  figure {
    min-width: 140px;
  }
  img {
    height: 100%;
  }
</style>