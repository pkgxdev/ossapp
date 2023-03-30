<script lang="ts">
	import { authStore } from '$libs/stores';
	import SelectLang from '$components/select-lang/select-lang.svelte';
	import { baseUrl } from '$libs/v1-client';
	import { shellOpenExternal, submitLogs } from '@native';
  const { user, deviceIdStore } = authStore;

  const openGithub = () => {
		shellOpenExternal(`${baseUrl}/auth/user?device_id=${$deviceIdStore}`)
		try {
			authStore.pollSession();
		} catch (error) {
			console.error(error);
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
</script>
<nav class="w-full p-2 text-sm">
  {#if $user}
    <section class="flex rounded-full mb-2 pl-1">
      <img width="40" height="40" src={$user?.avatar_url || '/images/bored-ape.png'} alt="profile" />
      <div class="text-gray p-2">@{$user?.login}</div>
    </section>
  {:else}
    <button
      class={`mt-2 transition-all rounded-sm w-full h-8 pl-1 text-left hover:bg-gray hover:border focus:bg-secondary ${submittedMessage === "syncing..." && "animate-pulse"}`}
      on:click={openGithub}>
      login
    </button>
  {/if}
  <hr class="mt-2 border border-gray border-b-0  border-t-0"/>
  <SelectLang/>
  <hr class="mt-2 border border-gray border-b-0  border-t-0"/>
  <button
    class={`mt-2 transition-all rounded-sm w-full h-8 pl-1 text-left hover:bg-gray  hover:border focus:bg-secondary ${submittedMessage === "syncing..." && "animate-pulse"}`}
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
</style>