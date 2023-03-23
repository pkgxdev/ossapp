<script lang="ts">
	import { authStore } from '$libs/stores';
	import SelectLang from '$components/select-lang/select-lang.svelte';
	import { baseUrl } from '$libs/v1-client';
	import { shellOpenExternal } from '@native';
  const { user, deviceIdStore } = authStore;

  const openGithub = () => {
		shellOpenExternal(`${baseUrl}/auth/user?device_id=${$deviceIdStore}`)
		try {
			authStore.pollSession();
		} catch (error) {
			console.error(error);
		}
	};

  let submittedMessage = "hello";
  const submitLogs = async () => {
    console.log("log")
  }
</script>
<nav class="bg-opacity-20 w-full h-full p-4">
  {#if $user}
    <section class="flex rounded-full mb-2">
      <img width="40" height="40" src={$user?.avatar_url || '/images/bored-ape.png'} alt="profile" />
      <div class="text-gray p-2">@{$user?.login}</div>
    </section>
  {:else}
    <button class="flex border border-gray rounded-sm w-full mb-2 h-8 items-center" on:click={openGithub}>
      <figure class="p-2">
        <img width="18" height="18" src="/images/github.png" alt="profile" />
      </figure>
      <div class="text-gray">Login</div>
    </button>
  {/if}
  <SelectLang/>
  <button
    class="mt-2 border transition-all border-gray rounded-sm w-full mb-2 h-8 text-center hover:bg-gray focus:bg-primary"
    on:click={submitLogs}>
    SUBMIT LOGS
  </button>
  {#if submittedMessage}
    <p class="text-gray text-xs mt-2">{submittedMessage}</p>
  {/if}
</nav>