import { writable } from "svelte/store";
import { nanoid } from "nanoid";

import { NotificationType } from "@tea/ui/types";
import type { Notification } from "@tea/ui/types";

import { listenToChannel, enableMagic, isMagicEnabled } from "@native";
import log from "$libs/logger";

const actionCallback: { [action_key: string]: () => Promise<void> } = {
  "enable-magic": enableMagic
};

export default function initNotificationStore() {
  const notifications: Notification[] = [];
  const { update, subscribe } = writable<Notification[]>([]);

  const remove = (id: string) => {
    update((notifications) => notifications.filter((n) => n.id != id));
  };

  listenToChannel("message", (data: any) => {
    log.info("message", data);
    console.log("wut", data);
    const { message, params }: { message: string; params: { [key: string]: string } } = data;

    addActionNotification(message, params);
  });

  const addActionNotification = (message: string, params: { [key: string]: string }) => {
    update((value) => {
      const newNotification: Notification = {
        id: nanoid(4),
        message,
        i18n_key: params["i18n_key"] || "",
        type: NotificationType.ACTION_BANNER,
        params
      };
      if (params.action) {
        newNotification.callback_label = params.action.toUpperCase();
        newNotification.callback = () => {
          if (params.action_key && actionCallback[params.action_key]) {
            actionCallback[params.action_key]();
          }
          remove(newNotification.id); // not sure yet
        };
      }
      return [...value, newNotification];
    });
  };

  const init = () => {
    // should this be here?
    isMagicEnabled().then((enabled) => {
      log.info("is magic enabled", enabled);
      if (!enabled) {
        log.info("add notification!");
        addActionNotification("tea/cli magic is not enabled. Click here to enable it.", {
          action: "enable",
          action_key: "enable-magic"
        });
      }
    });
  };

  init();

  return {
    notifications,
    subscribe,
    remove,
    add: (partialNotification: Partial<Notification>) => {
      if (!partialNotification.message) throw new Error("message is required");

      const notification: Notification = {
        id: nanoid(4),
        i18n_key: partialNotification.i18n_key || "",
        type: NotificationType.MESSAGE,
        message: partialNotification.message || "",
        ...partialNotification
      };

      update((values) => [notification, ...values]);
    }
  };
}
