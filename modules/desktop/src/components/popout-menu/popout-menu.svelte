<script lang="ts">
	import { authStore, navStore } from '$libs/stores';
	import SelectLang from '$components/select-lang/select-lang.svelte';
	import { baseUrl } from '$libs/v1-client';
	import { shellOpenExternal, submitLogs } from '@native';
  import mouseLeaveDelay from "@tea/ui/lib/mouse-leave-delay";
  import { getSession } from '@native';

  const { user } = authStore;

  let authenticating = false;

  const openGithub = async () => {
    authenticating = true;
		try {
      const session = await getSession();
      if (session && session.device_id) {
		    shellOpenExternal(`${baseUrl}/auth/user?device_id=${session.device_id}`)
      }
			authStore.pollSession();
		} catch (error) {
      submittedMessage = (error as Error).message;
			console.error(error);
		} finally {
      authenticating = false;
    }
	};

  let submittedMessage = "";
  const onSubmitLogs = async () => {
    if (submittedMessage !== "syncing...") {
      submittedMessage = "syncing..."
      const msg = await submitLogs();
      submittedMessage = msg;
    }
  }

  const hidePopup = () => {
    navStore.sideNavOpen.set(false);
  }
</script>
<nav class="w-full p-2 text-sm" use:mouseLeaveDelay={2000} on:leave_delay={() => hidePopup()}>
  {#if $user}
    <section class="flex items-center justify-between p-1 hover:bg-gray hover:border hover:border-white  rounded-sm hover:bg-opacity-90 hover:text-black">
      <div class="text-white">@{$user?.login}</div>
      <img id="avatar" class="rounded-sm" src={$user?.avatar_url || '/images/bored-ape.png'} alt="profile" />
    </section>
  {:else}
    <button
      class="mt-2 p-1 transition-all rounded-sm w-full h-8 text-left hover:bg-gray hover:border focus:bg-secondary bg-opacity-40"
      class:animate-pulse={authenticating}
      on:click={openGithub}>
      login
    </button>
  {/if}
  <hr class="mt-2 border border-gray border-b-0  border-t-0"/>
  <SelectLang/>
  <hr class="border border-gray border-b-0  border-t-0"/>
  <button
    class="mt-2 p-1 transition-all rounded-sm w-full h-8 text-left hover:bg-gray hover:border focus:bg-secondary"
    class:animate-pulse={submittedMessage === "syncing..."}
    on:click={onSubmitLogs}>
    submit logs
  </button>
  {#if submittedMessage}
    <p class="text-gray text-xs mt-2">{submittedMessage}</p>
  {/if}
</nav>

<style>
  hr {
    border-width: 1px;
  }

  #avatar {
    height: 24px !important;
    width: 24px !important;
  }
</style>