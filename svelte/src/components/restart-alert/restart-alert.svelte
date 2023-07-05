<script lang="ts">
  import "$appcss";
  import Button from "$components/button/button.svelte";
  import { t } from "$libs/translations";
  import { relaunch } from "@native";
  import ModalContainer from "$components/modal-container/modal-container.svelte";
  import { notificationStore, appUpdateStore } from "$libs/stores";
  let countdownTimer = 10;
  const { restartAlert } = notificationStore;
  const { updateStatus } = appUpdateStore;

  const onCancel = () => {
    $restartAlert = false;
  };

  let countdown: NodeJS.Timer | null = null;
  const onStartUpdate = () => {
    if (!countdown) {
      countdown = setInterval(() => {
        countdownTimer--;
        if (countdownTimer === 0) {
          clearInterval(countdown!);
          relaunch();
        }
      }, 1000);
    }
  };

  $: version = $updateStatus.version || "0.0.0";
</script>

<ModalContainer
  on:close={() => {
    console.log("close here");
  }}
>
  {#if !countdown}
    <div class="border-gray rounded-lg border-2 border-r-0 border-t-0 bg-black p-8 text-center">
      <h1 class="text-lg">
        <!-- TODO: figure out why unable to parse variable type correctly -->
        {$t("notification.update-header").replace("{version}", `v${version}`)}
      </h1>
      <p class="text-sm">{$t("notification.gui-restarting")}</p>
      <nav class="mt-8 flex items-center justify-center gap-4 px-8">
        <Button onClick={onStartUpdate} type="plain">{$t("action.update").toUpperCase()}</Button>
        <Button onClick={onCancel} type="outline" color="black"
          >{$t("action.cancel").toUpperCase()}</Button
        >
      </nav>
    </div>
  {:else}
    <div
      class="border-gray w-1/2 rounded-lg border-2 border-r-0 border-t-0 bg-black p-8 text-center"
    >
      <h1 class="text-lg capitalize">{$t("package.cta-UPDATING").toLowerCase()}...</h1>
      <h3 class="text-3xl text-white">{countdownTimer}</h3>
    </div>
  {/if}
</ModalContainer>
