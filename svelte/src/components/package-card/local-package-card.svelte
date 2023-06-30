<script lang="ts">
  import "../../app.css";
  import type { GUIPackage } from "$libs/types";
  import { t } from "$libs/translations";
  import BgImage from "./bg-image.svelte";
  import { getPackageName } from "$libs/packages/pkg-utils";
  import OpenPackageButton from "$components/buttons/open-package-button.svelte";
  // import { toLower } from "lodash";
  // Local packages are packages that are under development and are not yet published to the pantry
  // They are currently so different from regular packages it's easier to have a separate component for them
  export let pkg: GUIPackage;
</script>

<div class="relative">
  <section
    class="border-gray relative box-border h-[340px] w-full border bg-cover transition-all duration-300"
  >
    <BgImage class="absolute left-0 top-0 h-full w-full" {pkg} />

    <div>
      <div
        data-testid={`package-card-${pkg.slug}`}
        class="absolute h-full w-full flex-col justify-between"
      >
        <div
          class="absolute left-3 top-3 flex h-5 items-center rounded-sm bg-white px-2 text-xs text-black"
        >
          {$t("package.local-package").toLowerCase()}
        </div>
        <div
          class="content-container absolute bottom-0 left-0 flex h-1/2 w-full flex-col justify-center px-3.5 py-7"
        >
          <article class="w-full text-left">
            <div class="flex items-center">
              <h3 class="text-bold font-mona line-clamp-1 text-2xl font-bold text-white">
                {getPackageName(pkg)}
              </h3>
              <i class="icon-check-circle-o mb-1 ml-2 flex text-2xl text-[#e1e1e1]" />
            </div>
            <p class="line-clamp-2 h-[32px] text-xs font-thin lowercase">
              {pkg.short_description ?? ""}
            </p>
          </article>
          <div class="mt-3.5 w-full">
            <div class="flex w-fit flex-col items-center">
              <div class="w-fit min-w-[160px]">
                <OpenPackageButton {pkg} buttonSize="small" />
              </div>
              <div class="mt-1.5 h-[10px] leading-[10px]">
                <span class="text-[10px]">{$t("package.not-in-pantry").toLowerCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .content-container {
    background: linear-gradient(180deg, rgba(26, 26, 26, 0.3) 0%, rgba(26, 26, 26, 0.75) 72.92%);
  }
</style>
