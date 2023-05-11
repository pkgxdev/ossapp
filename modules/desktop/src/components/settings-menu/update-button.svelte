<script lang="ts">
  import Spinner from "@tea/ui/spinner/spinner.svelte";
  import { relaunch } from "@native";
  import { appUpdateStore } from "$libs/stores";

  const { updateStatus } = appUpdateStore;

  let updateClickCount = 0;
  const onRelaunch = async () => {
    if (updateClickCount < 1) {
      await relaunch();
    }
    updateClickCount++;
  };
</script>

{#if $updateStatus.status === "up-to-date"}
  <div
    class="flex h-7 w-full items-center justify-between p-1 text-left outline-1 outline-gray hover:bg-gray hover:bg-opacity-25 hover:outline"
  >
    <div>up to date</div>
    <i class="installed-text icon-check-circle-o flex text-[#00ffd0]" />
  </div>
{:else if $updateStatus.status === "available"}
  <div
    class="flex h-7 w-full items-center justify-between p-1 text-left outline-1 outline-gray hover:bg-gray hover:bg-opacity-25 hover:outline"
  >
    <div>fetching update</div>
    <Spinner />
  </div>
{:else if $updateStatus.status === "ready"}
  <button
    class="flex h-7 w-full items-center justify-between p-1 text-left outline-1 outline-gray hover:bg-gray hover:bg-opacity-25 hover:outline"
    on:click={onRelaunch}
  >
    <div class="flex items-center">
      <div class="circle-badge mr-2">1</div>
      <div>update</div>
    </div>
    <div class="rounded-sm bg-white px-2 text-[10px] leading-[12px] text-black">
      v{$updateStatus.version}
    </div>
  </button>
{/if}

{#if $updateStatus.status === "ready" && updateClickCount >= 3}
  <p class="p-1 text-xs text-primary">Force quit and relaunch the app, please.</p>
{/if}

<style>
  .circle-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background: #ff4100;
    font-size: 10px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
  }
</style>
