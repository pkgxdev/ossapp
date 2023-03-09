import { Titlebar } from "custom-electron-titlebar";

const isVite = () => {
	try {
		return window.location.href.includes("is-vite");
	} catch (error) {
		return false;
	}
};

if (!isVite()) {
	const { init } = window.require("@sentry/electron/renderer");
	const SvelteSentry = window.require("@sentry/svelte");
	init(
		{
			dsn: "https://5ff29bb5b3b64cd4bd4f4960ef1db2e3@o4504750197899264.ingest.sentry.io/4504750206746624",
			debug: true
		},
		SvelteSentry.init
	);
}

window.addEventListener("DOMContentLoaded", () => {
	// Title bar implemenation
	new Titlebar({
		titleHorizontalAlignment: "left"
	});
});
