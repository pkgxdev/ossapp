// const { contextBridge, ipcRenderer } = require("electron");
const { init } = require("@sentry/electron/renderer");
const SvelteSentry = require("@sentry/svelte");

// contextBridge.exposeInMainWorld("electron", {
// 	send: (channel, data) => {
// 		ipcRenderer.send(channel, data);
// 	},
// 	sendSync: (channel, data) => {
// 		ipcRenderer.sendSync(channel, data);
// 	},
// 	receive: (channel, func) => {
// 		ipcRenderer.on(channel, (event, ...args) => func(...args));
// 	}
// });

init(
	{
		dsn: "https://5ff29bb5b3b64cd4bd4f4960ef1db2e3@o4504750197899264.ingest.sentry.io/4504750206746624",
		debug: true
	},
	SvelteSentry.init
);
