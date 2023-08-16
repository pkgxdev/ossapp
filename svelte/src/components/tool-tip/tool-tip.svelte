<script lang="ts">
  // TODO: this tool tip assumes it is below the target element, when multiple directions are needed, this will need to be updated
</script>

<div class="group relative">
  <slot name="target" />
  <div
    class="tooltip border-gray invisible absolute top-full left-1/2 z-50 mt-4 w-full min-w-max translate-x-[-50%] border bg-black transition-all group-hover:visible"
  >
    <div class="px-6 py-2">
      <slot name="tooltip-content" />
    </div>
  </div>
</div>

<style>
  .tooltip::before {
    content: "";
    position: absolute;
    top: -9px;
    left: calc(50% - 8px);
    height: 16px;
    width: 16px;
    background: #1a1a1a;
    transform: rotate(45deg);
    border-top: inherit;
    border-left: inherit;
    box-shadow: inherit;
  }
</style>
