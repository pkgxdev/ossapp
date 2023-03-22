import Pushy from "pushy-electron";
import { readSessionData } from "./auth";
import { post } from "./v1-client";
import * as log from "electron-log";
import { BrowserWindow } from "electron";

export default function initialize(mainWindow: BrowserWindow) {
	Pushy.listen();
	// Register device for push notifications
	Pushy.register({ appId: "64110fb47446e48a2a0e906d" })
		.then(async (token) => {
			const { device_id } = await readSessionData();
			if (device_id)
				await post(`/auth/device/${device_id}/register-push-token`, { push_token: token });
		})
		.catch((err) => {
			log.error(err);
			// Display error dialog
			// Pushy.alert(mainWindow, 'Pushy registration error: ' + err.message);
		});

	// Listen for incoming notifications
	Pushy.setNotificationListener((data: any) => {
		// Display an alert with the "message" payload value
		log.info("push data:", data);
		// TODO: replace this with something
		Pushy.alert(mainWindow, data?.message as string);
	});
}
