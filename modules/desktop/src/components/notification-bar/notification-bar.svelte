<script lang="ts">
	import '$appcss';
	import { t } from "$libs/translations";
	import { notificationStore } from '$libs/stores';
	import Notification from "@tea/ui/notification/notification.svelte";
</script>

<div class="w-full flex flex-col gap-1 py-2 pl-2 pr-4">
  {#each $notificationStore as notification}
    <Notification
      notification={{
        ...notification,
        // TODO this looks nasty but cleanup later.
        message: notification.i18n_key ? $t(notification.i18n_key, notification.params) : notification.message
      }}
        onClose={() => {
        notificationStore.remove(notification.id);
      }}
    />
  {/each}
</div>