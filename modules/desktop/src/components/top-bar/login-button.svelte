<script lang="ts">
  import { authStore } from "$libs/stores";
  import { getSession } from "@native";
  import { getBaseURL } from "$libs/v1-client";
  import { shellOpenExternal, pollDeviceSession } from "@native";
  import mouseLeaveDelay from "$components/lib/mouse-leave-delay";
  const { user } = authStore;

  $: authenticating = false;

  $: isLogoutOpen = false;

  const openGithub = async () => {
    if (!authenticating) {
      authenticating = true;
      try {
        const session = await getSession();

        if (session && session.device_id) {
          const baseUrl = await getBaseURL();
          shellOpenExternal(`${baseUrl}/v1/auth/user?device_id=${session.device_id}`);
          pollDeviceSession();
        } else {
          throw new Error("possible no internet connection");
        }
      } catch (error) {
        console.error(error);
      } finally {
        authenticating = false;
      }
    }
    isLogoutOpen = false;
  };

  const logout = () => authStore.clearSession();

  const preventDoubleClick = (evt: MouseEvent) => evt.stopPropagation();
</script>

{#if $user}
  <div class="relative" use:mouseLeaveDelay={2000} on:leave_delay={() => (isLogoutOpen = false)}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <section
      class="group flex h-[28px] min-w-[120px] max-w-[160px] items-center justify-between rounded-sm border border-gray bg-black pl-2 text-sm text-gray transition-all
		hover:bg-[#e1e1e1] hover:text-black"
      on:click={() => (isLogoutOpen = !isLogoutOpen)}
      on:dblclick={preventDoubleClick}
    >
      <div class="mr-1 text-gray line-clamp-1 group-hover:text-black">@{$user?.login}</div>
      <img
        id="avatar"
        class="flex rounded-sm"
        src={$user?.avatar_url || "/images/bored-ape.png"}
        alt="profile"
      />
    </section>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="group absolute z-50 mt-1 flex h-[28px] w-[120px] items-center justify-between rounded-sm border border-gray bg-black pl-3 text-sm text-gray transition-all
		hover:bg-[#e1e1e1] hover:text-black"
      class:invisible={!isLogoutOpen}
      class:visible={isLogoutOpen}
      on:click={logout}
    >
      log out
    </div>
  </div>
{:else}
  <button
    class="h-[28px] w-[120px] rounded-sm border border-gray px-1 text-sm text-gray transition-all hover:bg-[#e1e1e1] hover:text-black"
    class:animate-pulse={authenticating}
    on:click={openGithub}
    on:dblclick={preventDoubleClick}
  >
    log in
  </button>
{/if}

<style>
  #avatar {
    padding: 1px;
    height: 26px !important;
    width: 26px !important;
  }
</style>
