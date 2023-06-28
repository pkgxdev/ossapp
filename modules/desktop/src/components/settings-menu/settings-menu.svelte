<script lang="ts">
  import { shellOpenExternal } from "@native";
  import mouseLeaveDelay from "$components/lib/mouse-leave-delay";
  import UpdateButton from "./update-button.svelte";
  import { appUpdateStore } from "$libs/stores";
  import SelectLang from "$components/select-lang/select-lang.svelte";
  const { updateStatus } = appUpdateStore;

  const hidePopup = () => {
    isOpen = false;
  };

  const preventDoubleClick = (evt: MouseEvent) => evt.stopPropagation();

  $: isOpen = false;
</script>

<div
  class="relative"
  use:mouseLeaveDelay={2000}
  on:leave_delay={() => hidePopup()}
  on:dblclick={preventDoubleClick}
>
  <button
    class="group flex h-[28px] w-[28px] items-center justify-center rounded-sm border border-gray hover:bg-[#e1e1e1]"
    class:circle-badge={$updateStatus.status === "available" || $updateStatus.status === "ready"}
    on:click={() => (isOpen = !isOpen)}
    title="settings"
  >
    <div class="icon-gear text-l flex text-gray group-hover:text-black" />
  </button>

  <nav
    class="menu absolute w-full border border-gray bg-black p-2 text-xs transition-all"
    class:invisible={!isOpen}
    class:visible={isOpen}
  >
    <button
      class="h-7 w-full p-1 text-left outline-1 outline-gray hover:bg-gray hover:bg-opacity-25 hover:outline"
      on:click={() => shellOpenExternal("https://docs.tea.xyz")}
    >
      docs
    </button>
    <hr />
    <UpdateButton />
    <hr />
    <button class="min-h-8 w-full text-left transition-all focus:bg-secondary">
      <SelectLang />
    </button>
  </nav>
</div>

<style>
  hr {
    border: 1px solid #272626;
    margin: 1px 0;
  }

  .menu {
    top: calc(100% + 4px);
    left: calc(50% - 80px);
    width: 160px;
  }

  .circle-badge::after {
    content: "1";
    position: absolute;
    width: 14px;
    height: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 50%;
    background: #ff4100;
    font-size: 10px;
    top: -7px;
    right: -7px;
    z-index: 1;
  }
</style>
