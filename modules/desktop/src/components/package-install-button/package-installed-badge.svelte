<script lang="ts">
  import type { GUIPackage } from "$libs/types";

  export let pkg: GUIPackage | null = null;
</script>

<div class="container relative h-full" data-testid={`install-badge-${pkg?.slug}`}>
  <div class="content flex items-center justify-center gap-2 p-2">
    <i class="icon-check-circle-o flex text-sm text-[#00ffd0]" />
    <div class="text-xs">INSTALLED</div>
    <div class="rounded-sm bg-white px-1 text-[10px] leading-[12px] text-black">
      v{pkg?.installed_versions?.[0]}
    </div>
  </div>
</div>

<style>
  .content {
    position: relative;
    z-index: 2;
  }

  .container::before {
    content: "";
    position: absolute;
    mix-blend-mode: overlay;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: #dedede;
    z-index: 0;
  }
</style>
