import * as Sentry from "@sentry/browser";

export function initSentry() {
	Sentry.init({
		dsn: "https://5ff29bb5b3b64cd4bd4f4960ef1db2e3@o4504750197899264.ingest.sentry.io/4504750206746624"
	});
}

export function captureException(exception: any) {
	Sentry.captureException(exception);
}
