import { writable } from "svelte/store";
import { nanoid } from "nanoid";

import { NotificationType } from "@tea/ui/types";
import type { Notification } from "@tea/ui/types";

import { listenToChannel, relaunch } from "@native";

export default function initNotificationStore() {
	const notifications: Notification[] = [];
	const { update, subscribe } = writable<Notification[]>([]);

	listenToChannel("message", (message: string, params: any) => {
		update((value) => {
			const newNotification: Notification = {
				id: nanoid(4),
				message,
				type: NotificationType.ACTION_BANNER
			};
			if (params.action) {
				newNotification.callback_label = params.action;
				newNotification.callback = () => {
					relaunch();
				};
			}
			return [...value, newNotification];
		});
	});

	return {
		notifications,
		subscribe
	};
}
