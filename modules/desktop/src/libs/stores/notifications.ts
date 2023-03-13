import { writable } from "svelte/store";
import { nanoid } from "nanoid";

import { l } from "$libs/translations";
import { NotificationType } from "@tea/ui/types";
import type { Notification } from "@tea/ui/types";

import { listenToChannel, relaunch } from "@native";

export default function initNotificationStore() {
	const notifications: Notification[] = [];
	const { update, subscribe } = writable<Notification[]>([]);

	const remove = (id: string) => {
		update((notifications) => notifications.filter((n) => n.id != id));
	};

	listenToChannel("message", (message: string, params: { [key: string]: string }) => {
		update((value) => {
			const newNotification: Notification = {
				id: nanoid(4),
				message,
				i18n_key: params["i18n_key"] || "",
				type: NotificationType.ACTION_BANNER,
				params
			};
			if (params.action) {
				newNotification.callback_label = params.action;
				newNotification.callback = () => {
					relaunch();
					remove(newNotification.id); // not sure yet
				};
			}
			return [...value, newNotification];
		});
	});

	return {
		notifications,
		subscribe,
		remove
	};
}
