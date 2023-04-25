import { type AppUpdater, autoUpdater } from "electron-updater";
import log from "./logger";
import { BrowserWindow } from "electron";

type AutoUpdateStatus = {
	status: "up-to-date" | "available" | "ready";
	version?: string;
};

autoUpdater.logger = log;

let window: BrowserWindow;
let initalized = false;

// keep the last status to resend to the window when it's opened becuase the store is destroyed when the window is closed
let lastStatus: AutoUpdateStatus = { status: "up-to-date" };

export const getUpdater = () => autoUpdater;

export function checkUpdater(mainWindow: BrowserWindow): AppUpdater {
	window = mainWindow;
	autoUpdater.checkForUpdatesAndNotify();

	if (!initalized) {
		initalized = true;

		setInterval(() => {
			autoUpdater.checkForUpdatesAndNotify();
		}, 1000 * 60 * 30); // check for updates every 30 minutes
	}

	return autoUpdater;
}

// The auto update runs in the background so the window might not be open when the status changes
// When the update store gets created as part of the window it will request the latest status.
export function getAutoUpdateStatus() {
	return lastStatus;
}

function sendStatusToWindow(status: AutoUpdateStatus) {
	lastStatus = status;
	window?.webContents.send("app-update-status", status);
}

autoUpdater.on("checking-for-update", () => {
	log.info("checking for tea gui update");
});

autoUpdater.on("update-available", (info) => {
	sendStatusToWindow({ status: "available" });
});

autoUpdater.on("update-not-available", () => {
	log.info("no update for tea gui");
	sendStatusToWindow({ status: "up-to-date" });
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
	sendStatusToWindow({ status: "ready", version: info.version });
});
