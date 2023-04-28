<script lang="ts">
  import "$appcss";
  import { t } from "$libs/translations";
  import { notificationStore } from "$libs/stores";
  import Notification from "@tea/ui/notification/notification.svelte";
</script>

<div class="flex w-full flex-col gap-1">
  {#each $notificationStore as notification}
    <Notification
      notification={{
        ...notification,
        // TODO this looks nasty but cleanup later.
        message: notification.i18n_key
          ? $t(notification.i18n_key, notification.params)
          : notification.message
      }}
      onClose={() => {
        notificationStore.remove(notification.id);
      }}
    />
  {/each}
</div>
