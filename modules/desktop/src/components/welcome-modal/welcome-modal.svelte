<script lang="ts">
  import Button from "@tea/ui/button/button.svelte";
  import { PackageStates, type GUIPackage } from "$libs/types";
	import { openTerminal, isPackageInstalled, installTeaCli } from '@native';
  import { packagesStore } from "$libs/stores";
	import clickOutside from "@tea/ui/lib/clickOutside";
  import ProgressBar from "@tea/ui/progress-bar/progress-bar.svelte";
  import { onMount } from "svelte";

  import { withFakeLoader } from "$libs/stores/pkgs";

  const log = window.require("electron-log");

  export let tea:GUIPackage|undefined;

  let installing = false;
  let installProgress = 0;
  let message:string;
  let errorMessage = "";
  let fakeTimer: NodeJS.Timer;
  
  let checkTeaPoll: NodeJS.Timer | null;
  const checkInstalled = async () => {
    if (checkTeaPoll) return;
    return new Promise((resolve) => {
      checkTeaPoll = setInterval(async () => {
        try {
          log.info("checking if tea is installed");
          const installed = await isPackageInstalled("tea.xyz", tea?.version);
            log.info("tea is installed:", installed);
          if (installed && checkTeaPoll) {
            clearInterval(checkTeaPoll);
            checkTeaPoll = null;
            resolve(null);
            close();
          }
        } catch (error) {
          log.error(error);
        }
      }, 5000); // check every 5s
    })
  }

  const close = () => {
    packagesStore.requireTeaCli.set(false);
  }

  const onOpenTerminal = async () => {
    if (installing) return;
    installing = true;
		try {
			openTerminal(`sh <(curl https://tea.xyz)`);
      await checkInstalled();
      packagesStore.updatePackage("tea.xyz", {
        state: PackageStates.INSTALLED,
        installed_versions: [tea?.version || "latest"]
      });
		} catch (error) {
			console.log("install failed")
		} finally {
      installing = false;
    }
	}

  const setupCli = async () => {
    installing = true;
    if (tea) {
      fakeTimer = withFakeLoader(tea, (p) => {
        installProgress = p;
      })
      try {
        message = await installTeaCli(tea.version);
        console.log("MESSAGE:", message)
        if (message != "success") {
          errorMessage = message;
        }
      } catch (error) {
        console.log("install failed cli", error)
      } finally {
        clearInterval(fakeTimer);
        installing = false;
        installProgress = 100;
      }
    }
  }

  onMount(() => {
    setupCli();
  })
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

        {#if !errorMessage}
          {#if installProgress != 100}
            <ProgressBar width={installProgress} />
            <p class="text-gray text-sm mt-2">initializing the app. please wait for a few seconds</p>
          {:else}
            <p class="text-gray text-sm mt-2">setup was succesfull!</p>
            <Button type="plain" color="secondary" class="w-7/12"
              onClick={() => close()}
            >
              EXPLORE OPEN-SOURCE
            </Button>
          {/if}
        {:else}
          <div class="h-10 w-7/12">
            <Button type="plain" color="secondary"
              loading={installing}
              onClick={onOpenTerminal}
            >
              INSTALL TEA CLI v{tea?tea.version:"latest"}
            </Button>
          </div>
          <p class="text-gray text-sm mt-2">tea cli is required in order to use our app. Clicking the link above will automatically install it via your command-line.</p>
        {/if}
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