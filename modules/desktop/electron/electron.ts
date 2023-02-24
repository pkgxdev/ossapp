import windowStateManager from "electron-window-state";
import { app, BrowserWindow, ipcMain } from "electron";
import contextMenu from "electron-context-menu";
import serve from "electron-serve";

import { getInstalledPackages } from "./libs/tea-dir";
import { readSessionData, writeSessionData } from "./libs/auth";
import type { Session } from "../src/libs/types";
import { installPackage, openTerminal } from "./libs/cli";
import { autoUpdater } from "electron-updater";
import * as log from "electron-log";

autoUpdater.logger = log;
log.info("App starting...");

const serveURL = serve({ directory: "." });
const port = process.env.PORT || 3000;
const dev = !app.isPackaged;
let mainWindow: BrowserWindow | null;

function createWindow() {
	const windowState = windowStateManager({
		defaultWidth: 800,
		defaultHeight: 600
	});

	const mainWindow = new BrowserWindow({
		backgroundColor: "whitesmoke",
		autoHideMenuBar: true,
		trafficLightPosition: {
			x: 17,
			y: 32
		},
		minHeight: 450,
		minWidth: 500,
		webPreferences: {
			// enableRemoteModule: true,
			contextIsolation: false,
			nodeIntegration: true,
			spellcheck: false,
			webSecurity: false,
			devTools: dev
			// preload: path.join(app.getAppPath(), 'preload.cjs')
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height
	});

	windowState.manage(mainWindow);

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on("close", () => {
		windowState.saveState(mainWindow);
	});

	return mainWindow;
}

function sendStatusToWindow(text) {
	log.info(text);
	mainWindow?.webContents.send("message", text);
}
autoUpdater.on("checking-for-update", () => {
	sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
	sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
	sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
	sendStatusToWindow("Error in auto-updater. " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
	let log_message = "Download speed: " + progressObj.bytesPerSecond;
	log_message = log_message + " - Downloaded " + progressObj.percent + "%";
	log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
	sendStatusToWindow(log_message);
});

autoUpdater.on("update-downloaded", (info) => {
	sendStatusToWindow("Update downloaded");
});

contextMenu({
	showLookUpSelection: false,
	showSearchWithGoogle: false,
	showCopyImage: false,
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: "Make App 💻"
		}
	]
});

function loadVite(port) {
	mainWindow?.loadURL(`http://localhost:${port}`).catch((e) => {
		console.log("Error loading URL, retrying", e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

function createMainWindow() {
	autoUpdater.checkForUpdatesAndNotify();
	mainWindow = createWindow();
	mainWindow.once("close", () => {
		mainWindow = null;
	});

	if (dev) loadVite(port);
	else serveURL(mainWindow);
}

app.once("ready", createMainWindow);
app.on("activate", () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("get-installed-packages", async () => {
	const pkgs = await getInstalledPackages();
	return pkgs;
});

ipcMain.handle("get-session", async () => {
	const session = await readSessionData();
	return session;
});

ipcMain.handle("update-session", async (_, data) => {
	await writeSessionData(data as Session);
});

ipcMain.handle("install-package", async (_, data) => {
	const result = await installPackage(data.full_name);
	return result;
});

ipcMain.handle("open-terminal", async (_, data) => {
	const { cmd } = data as { cmd: string };
	try {
		// TODO: detect if mac or linux
		// current openTerminal is only design for Mac
		await openTerminal(cmd);
	} catch (error) {
		console.error("elast:", error);
	}
});

ipcMain.handle("get-lang", function () {
	return app.getLocale();
});
