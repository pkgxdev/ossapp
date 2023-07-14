<script lang="ts">
  import type { Bottle } from "$libs/types";
  export let bottles: Bottle[];
  import { semverCompare } from "$libs/packages/pkg-utils";

  let versions: string[] = [];
  let available: Set<string>;

  $: versions = [...new Set(bottles.map((b) => b.version))].sort((a, b) => semverCompare(b, a));
  $: available = new Set(bottles.map((b) => `${b.platform}-${b.arch}`));
</script>

<div class="my-4 w-full p-2">
  <div>
    <h4 class="text-primary mb-4 text-lg">
      {versions.length} version{versions.length === 1 ? "" : "s"} bottled
    </h4>
  </div>
  <table class="border-gray w-full table-auto border">
    <thead>
      <tr>
        <th class="border-gray border px-2 py-4">version</th>
        <th class="border-gray border px-2 py-4">darwin-aarch64</th>
        <th class="border-gray border px-2 py-4">darwin-x86-64</th>
        <th class="border-gray border px-2 py-4">linux-aarch64</th>
        <th class="border-gray border px-2 py-4">linux-x86-64</th>
      </tr>
    </thead>
    <tbody>
      {#each versions as version}
        <tr>
          <th class="border-gray border px-2 py-4 text-left">{version}</th>
          <td class="border-gray border px-2 py-4"
            >{available.has("darwin-aarch64") ? "✅" : "❌"}</td
          >
          <td class="border-gray border px-2 py-4"
            >{available.has("darwin-x86-64") ? "✅" : "❌"}</td
          >
          <td class="border-gray border px-2 py-4"
            >{available.has("linux-aarch64") ? "✅" : "❌"}</td
          >
          <td class="border-gray border px-2 py-4">{available.has("linux-x86-64") ? "✅" : "❌"}</td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>
