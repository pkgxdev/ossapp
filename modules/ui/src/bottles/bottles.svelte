<script lang="ts">
  import type { Bottle } from "../types";
  export let bottles: Bottle[];

  let versions: string[] = [];
  let available: Set<string>;

  $: versions = [...new Set(bottles.map((b) => b.version))];
  $: available = new Set(bottles.map((b) => `${b.platform}-${b.arch}`));
</script>

<div class="my-4 w-full p-2">
  <div>
    <h4 class="mb-4 text-lg text-primary">
      {versions.length} version{versions.length === 1 ? "" : "s"} bottled
    </h4>
  </div>
  <table class="w-full table-auto border border-gray">
    <thead>
      <tr>
        <th class="border border-gray px-2 py-4">version</th>
        <th class="border border-gray px-2 py-4">darwin-aarch64</th>
        <th class="border border-gray px-2 py-4">darwin-x86-64</th>
        <th class="border border-gray px-2 py-4">linux-aarch64</th>
        <th class="border border-gray px-2 py-4">linux-x86-64</th>
      </tr>
    </thead>
    <tbody>
      {#each versions as version}
        <tr>
          <th class="border border-gray px-2 py-4 text-left">{version}</th>
          <td class="border border-gray px-2 py-4"
            >{available.has("darwin-aarch64") ? "✅" : "❌"}</td
          >
          <td class="border border-gray px-2 py-4"
            >{available.has("darwin-x86-64") ? "✅" : "❌"}</td
          >
          <td class="border border-gray px-2 py-4"
            >{available.has("linux-aarch64") ? "✅" : "❌"}</td
          >
          <td class="border border-gray px-2 py-4">{available.has("linux-x86-64") ? "✅" : "❌"}</td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>
