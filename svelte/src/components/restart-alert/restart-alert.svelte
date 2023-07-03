<script lang="ts">
  import NotificationBar from "$components/notification-bar/notification.svelte";
  import { type Notification, NotificationType } from "$libs/types";
  import { t } from "$libs/translations";
  import { onMount } from "svelte";
  import { relaunch } from "@native";
  let countdownTimer = 15;

  const notification: Notification = {
    id: "restart-alert",
    type: NotificationType.ACTION_BANNER,
    message: "",
    callback_label: "",
    callback: () => {
      relaunch();
    }
  };

  $: notification.message = $t("notification.gui-restarting");
  $: notification.callback_label = `${$t(
    "notification.gui-restart"
  )} (${countdownTimer})`.toUpperCase();

  onMount(() => {
    setInterval(() => {
      countdownTimer--;
      if (countdownTimer === 0 && notification.callback) {
        notification.callback();
      }
    }, 1000);
  });
</script>

<NotificationBar {notification} />
