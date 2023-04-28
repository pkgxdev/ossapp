import windowStateManager from "electron-window-state";
import { app, BrowserWindow, net } from "electron";
import { setupTitlebar, attachTitlebarToWindow } from "custom-electron-titlebar/main";
import * as Sentry from "@sentry/electron";
import contextMenu from "electron-context-menu";
import serve from "electron-serve";
import log, { setSentryLogging } from "./libs/logger";
import path from "path";
import { nameToSlug } from "./libs/package";
import { checkUpdater } from "./libs/auto-updater";

import initializeHandlers, { setProtocolPath } from "./libs/ipc";
import initializePushNotification, {
	syncPackageTopicSubscriptions
} from "./libs/push-notification";

import init from "./libs/initialize";
import { readSessionData } from "./libs/auth";

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
				return ol ? "send" : "queue";
			}
		}
	});
	Sentry.configureScope(async (scope) => {
		const session = await readSessionData();
		scope.setUser({
			id: session.device_id, // device_id this should exist in our pg db: developer_id is to many device_id
			username: session?.user?.login || "" // github username or handler
		});
	});
	setSentryLogging(Sentry);
}

init();

const serveURL = serve({ directory: "." });
const port = process.env.PORT || 3000;
const allowDebug = !app.isPackaged || process.env.DEBUG_BUILD === "1";
let mainWindow: BrowserWindow | null;

// todo: this is awful, there should be a way to check where all windows are closed in mac
let macWindowClosed = false;

setupTitlebar();

initializeHandlers({ notifyMainWindow });

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
			y: 15
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

	mainWindow.webContents.on("did-finish-load", () => {
		initializePushNotification(mainWindow);
	});

	attachTitlebarToWindow(mainWindow);
	return mainWindow;
}

contextMenu({
	showLookUpSelection: false,
	showSearchWithGoogle: false,
	showCopyImage: false
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
	if (mainWindow) {
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	} else {
		mainWindow = createWindow();
	}

	checkUpdater(mainWindow);

	mainWindow.once("close", () => {
		mainWindow = null;
	});

	if (!app.isPackaged) {
		// dev
		loadVite(port);
	} else {
		serveURL(mainWindow);
	}

	syncPackageTopicSubscriptions();
}

if (process.defaultApp) {
	app.setAsDefaultProtocolClient("tea", process.execPath, [path.resolve(process.argv[1])]);
} else {
	app.setAsDefaultProtocolClient("tea");
}

app.once("ready", createMainWindow);

app.on("activate", () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on("window-all-closed", () => {
	// mac ux is just minimize them when closed unless forced quite CMD+Q
	macWindowClosed = true;
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// NOTE: this doesnt work in linux
// 	you have to loop through process.argv to figure out which url launched the app
app.on("open-url", (event, url) => {
	// ie url:  tea://packages/slug
	event.preventDefault();

	const packagesPrefix = "/packages/";

	let rawPath = url.replace("tea:/", "");

	const isPackage = url.includes(packagesPrefix);
	if (isPackage) {
		// /packages/github.com/pypa/twine -> /packages/github_com_pypa_twine
		const packageSlug = nameToSlug(rawPath.replace(packagesPrefix, ""));
		rawPath = [packagesPrefix, packageSlug].join("");
	}

	setProtocolPath(rawPath);

	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
			log.info("restored");
		}
		mainWindow.webContents.send("sync-path");
		log.info("synced path", rawPath);
	} else if (macWindowClosed) {
		log.info("open new window");
		createMainWindow();
	}
});

function notifyMainWindow(channel: string, data: unknown) {
	if (mainWindow) {
		mainWindow.webContents.send(channel, data);
	}
}
