<script lang="ts">
  import { t } from "$libs/translations";
  import { PackageStates, type GUIPackage } from "$libs/types";
  import Button from "$components/button/button.svelte";
  import { getPackageBadgeTextKey } from "$libs/packages/pkg-utils";

  export let buttonSize: "small" | "large" = "small";

  export let pkg: GUIPackage;
  export let activeVersion = ""; // determine which version is being installed

  export let onClick = (_evt?: MouseEvent) => {
    console.log("do nothing");
  };

  const getColor = (state: PackageStates): "primary" | "secondary" | "black" => {
    if (state === PackageStates.INSTALLED) {
      return "black";
    }
    if (state === PackageStates.AVAILABLE || state === PackageStates.INSTALLING) {
      return "secondary";
    }
    return "primary";
  };

  const isActive = (state: PackageStates): boolean => {
    return state === PackageStates.INSTALLING || state === PackageStates.UPDATING;
  };

  const getVersion = (pkg: GUIPackage) => {
    if (pkg.state === PackageStates.INSTALLING && activeVersion) return activeVersion;
    if (pkg.state === PackageStates.INSTALLED) {
      return pkg.installed_versions?.[0] ?? pkg.version;
    }
    return pkg.version;
  };

  const badgeClass: Record<PackageStates, string> = {
    [PackageStates.AVAILABLE]: "install-badge",
    [PackageStates.INSTALLING]: "install-badge",
    [PackageStates.NEEDS_UPDATE]: "update-badge",
    [PackageStates.UPDATING]: "update-badge",
    [PackageStates.INSTALLED]: "installed-badge"
  };

  const hasVersionSelectorDropdown = !!$$slots.selector;
</script>

<Button
  data-testid="install-button-{pkg.slug}"
  class="w-full border p-0 text-xs text-white {buttonSize === 'small' ? 'h-8' : 'h-10'}"
  type="plain"
  color={getColor(pkg.state)}
  active={isActive(pkg.state)}
  {onClick}
>
  <div class="version-button h-full">
    <div class="flex h-full flex-col justify-center p-2">
      <div
        class="flex items-center gap-x-2 {hasVersionSelectorDropdown
          ? 'justify-between'
          : 'justify-center'}"
      >
        <div class="flex items-center gap-x-2" data-testid={`install-badge-${pkg?.slug}`}>
          <div>{$t(getPackageBadgeTextKey(pkg))}</div>
          <div class="version-label {badgeClass[pkg.state]}">v{getVersion(pkg)}</div>
        </div>
        {#if hasVersionSelectorDropdown}
          <i class="icon-downward-arrow flex" />
        {/if}
      </div>
    </div>
    <!-- This slot holds the drop down menu and it inside of the button so that the 
		hover effect remain on the button while the user is hovering the dropdown items-->
    <slot name="selector" />
  </div>
</Button>

<style>
  .version-label {
    font-size: 10px;
    line-height: 12px;
    padding: 0 4px;
    border-radius: 2px;
  }

  .install-badge {
    background-color: #dcb8ff;
    color: #8000ff;
  }

  .update-badge {
    background-color: #04957a;
    color: #00ffd0;
  }

  .installed-badge {
    background-color: white;
    color: #1a1a1a;
  }

  .version-button:hover .install-badge {
    background-color: white;
  }

  .version-button:hover .update-badge {
    background-color: #1a1a1a;
  }

  .version-button:hover .installed-badge {
    background-color: #1a1a1a;
    color: white;
  }
</style>
