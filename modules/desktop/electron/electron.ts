import windowStateManager from "electron-window-state";
import { app, BrowserWindow, ipcMain, net, dialog } from "electron";
import { setupTitlebar, attachTitlebarToWindow } from "custom-electron-titlebar/main";
import * as Sentry from "@sentry/electron";
import contextMenu from "electron-context-menu";
import serve from "electron-serve";

import { getInstalledPackages } from "./libs/tea-dir";
import { readSessionData, writeSessionData } from "./libs/auth";
import type { Session } from "../src/libs/types";
import { installPackage, openTerminal } from "./libs/cli";
import { autoUpdater } from "electron-updater";
import * as log from "electron-log";
import path from "path";

/*
 TODO:
 - fix global mutable variable
 - organize the ipc handlers into its own module
 - create auto updater initialization module
 */
let teaProtocolPath = ""; // this should be empty string

autoUpdater.logger = log;
log.info("App starting...");
if (app.isPackaged) {
	Sentry.init({
		dsn: "https://5ff29bb5b3b64cd4bd4f4960ef1db2e3@o4504750197899264.ingest.sentry.io/4504750206746624",
		debug: true,
		transportOptions: {
			maxQueueAgeDays: 30,
			maxQueueCount: 30,
			beforeSend: async () => {
				const ol = await net.isOnline();
				log.log("isOnline", ol);
				return ol ? "send" : "queue";
			}
		}
	});
}
const serveURL = serve({ directory: "." });
const port = process.env.PORT || 3000;
const allowDebug = !app.isPackaged || process.env.DEBUG_BUILD === "1";
let mainWindow: BrowserWindow | null;

setupTitlebar();

function createWindow() {
	const windowState = windowStateManager({
		defaultWidth: 1000,
		defaultHeight: 600
	});

	const mainWindow = new BrowserWindow({
		titleBarStyle: "hidden",
		backgroundColor: "black",
		autoHideMenuBar: true,
		trafficLightPosition: {
			x: 14,
			y: 13
		},
		minHeight: 600,
		minWidth: 1000,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			spellcheck: false,
			webSecurity: false,
			devTools: allowDebug,
			preload: path.join(app.getAppPath(), "preload.cjs")
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height
	});

	windowState.manage(mainWindow);
	mainWindow.webContents.openDevTools();
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on("close", () => {
		windowState.saveState(mainWindow);
	});

	attachTitlebarToWindow(mainWindow);
	return mainWindow;
}

function sendStatusToWindow(text: string, params?: { [key: string]: any }) {
	log.info(text);
	mainWindow?.webContents.send("message", text, params || {});
}

autoUpdater.on("checking-for-update", () => {
	log.info("checking for tea gui update");
});
autoUpdater.on("update-available", (info) => {
	sendStatusToWindow(
		`A new tea gui(${info.version}) is being downloaded. Please don't close the app.`,
		{
			i18n_key: "notification.gui-downloading"
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
		action: "relaunch"
	});
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
	mainWindow?.loadURL(`http://localhost:${port}?is-vite=true`).catch((e) => {
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

	if (mainWindow.isMinimized()) {
		mainWindow.restore();
	}

	if (!app.isPackaged) {
		// dev
		loadVite(port);
	} else {
		serveURL(mainWindow);
	}

	global.protocol_path = "hello-world";
}

if (process.defaultApp) {
	if (process.argv.length >= 2) {
		app.setAsDefaultProtocolClient("tea", process.execPath, [path.resolve(process.argv[1])]);
	}
} else {
	app.setAsDefaultProtocolClient("tea");
}

app.once("ready", createMainWindow);

app.on("activate", () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on("window-all-closed", async () => {
	await autoUpdater.quitAndInstall();
	app.quit();
});

// NOTE: this doesnt work in linux
// 	you have to loop through process.argv to figure out which url launched the app
app.on("open-url", (event, url) => {
	// ie url:  tea://packages/slug
	event.preventDefault();
	teaProtocolPath = url.replace("tea:/", "");
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

ipcMain.handle("relaunch", async () => {
	await autoUpdater.quitAndInstall();
});

ipcMain.handle("get-protocol-path", async () => {
	const path = teaProtocolPath;
	teaProtocolPath = "";
	return path;
});
