<script lang="ts">
  import Spinner from "$components/spinner/spinner.svelte";
  import { relaunch } from "@native";
  import { appUpdateStore } from "$libs/stores";

  const { updateStatus } = appUpdateStore;
</script>

{#if $updateStatus.status === "up-to-date"}
  <div
    class="outline-gray hover:bg-gray flex h-7 w-full items-center justify-between p-1 text-left outline-1 hover:bg-opacity-25 hover:outline"
  >
    <div>up to date</div>
    <i class="installed-text icon-check-circle-o flex text-[#00ffd0]" />
  </div>
{:else if $updateStatus.status === "available"}
  <div
    class="outline-gray hover:bg-gray flex h-7 w-full items-center justify-between p-1 text-left outline-1 hover:bg-opacity-25 hover:outline"
  >
    <div>fetching update</div>
    <Spinner />
  </div>
{:else if $updateStatus.status === "ready"}
  <button
    class="outline-gray hover:bg-gray flex h-7 w-full items-center justify-between p-1 text-left outline-1 hover:bg-opacity-25 hover:outline"
    on:click={relaunch}
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
