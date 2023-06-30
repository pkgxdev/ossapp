<script lang="ts">
  import "$appcss";

  import { NotificationType } from "$libs/types";
  import type { Notification } from "$libs/types";

  export let notification: Notification;

  export let onClose: () => void;

  const styles = {
    [NotificationType.MESSAGE]: "message-notification",
    [NotificationType.ERROR]: "error-notification",
    [NotificationType.ACTION_BANNER]: "action-banner-notification"
  };
</script>

<div class="flex w-full items-center justify-between px-4 py-2 {styles[notification.type]}">
  <div>{notification.message}</div>
  <div class="flex items-center gap-4">
    {#if notification.callback}
      <button
        class="h-10 w-32 rounded-sm bg-white text-black"
        on:click={() => {
          if (notification.callback) {
            notification.callback();
          }
        }}>{notification.callback_label}</button
      >
    {/if}
    <button
      data-testid="close-notification"
      class="close-notification icon-tea-x-btn mt-1 text-xs"
      on:click={onClose}
    />
  </div>
</div>

<style>
  /* FIXME: is there a better way to integrate this with tailwind? */
  .error-notification {
    background-color: #ff4100;
    color: #ffffff;
  }

  .message-notification {
    background-color: #8000ff;
    color: #ffffff;
  }

  .alert-notification {
    background-color: #8000ff;
    color: #ffffff;
  }

  .action-banner-notification {
    background-color: #8000ff;
    color: #ffffff;
  }
</style>
