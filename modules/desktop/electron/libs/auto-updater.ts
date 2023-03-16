import { type AppUpdater, autoUpdater } from "electron-updater";
import * as log from "electron-log";
import { BrowserWindow } from "electron";

autoUpdater.logger = log;

let window: BrowserWindow;

export const getUpdater = () => autoUpdater;
export function checkUpdater(mainWindow: BrowserWindow): AppUpdater {
	window = mainWindow;
	autoUpdater.checkForUpdatesAndNotify();

	return autoUpdater;
}

function sendStatusToWindow(text: string, params?: { [key: string]: any }) {
	log.info(text);
	window?.webContents.send("message", text, params || {});
}

autoUpdater.on("checking-for-update", () => {
	log.info("checking for tea gui update");
});
autoUpdater.on("update-available", (info) => {
	sendStatusToWindow(
		`A new tea gui(${info.version}) is being downloaded. Please don't close the app.`,
		{
			i18n_key: "notification.gui-downloading",
			version: info.version
		}
	);
});
autoUpdater.on("update-not-available", () => {
	log.info("no update for tea gui");
});
autoUpdater.on("error", (err) => {
	log.error("auto update:", err);
});
autoUpdater.on("download-progress", (progressObj) => {
	let log_message = "Download speed: " + progressObj.bytesPerSecond;
	log_message = log_message + " - Downloaded " + progressObj.percent + "%";
	log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
	log.info("tea gui:", log_message);
});
autoUpdater.on("update-downloaded", (info) => {
	sendStatusToWindow(`A new tea gui(${info.version}) is available. Relaunch the app to update.`, {
		i18n_key: "notification.gui-downloaded",
		version: info.version,
		action: "relaunch"
	});
});
