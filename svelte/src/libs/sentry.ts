import * as Sentry from "@sentry/browser";
import type { Session } from "./types";
import { isDev } from "@native";

export async function initSentry(session?: Session) {
  const dev = await isDev();
  if (!dev) {
    Sentry.init({
      environment: "production",
      dsn: "https://5ff29bb5b3b64cd4bd4f4960ef1db2e3@o4504750197899264.ingest.sentry.io/4504750206746624"
    });
    if (session) {
      console.log("sentry init", session);
      Sentry.configureScope(async (scope) => {
        scope.setUser({
          id: session.device_id, // device_id this should exist in our pg db: developer_id is to many device_id
          username: session?.user?.login || "", // github username or handler
          tea: session?.teaVersion || "unknown"
        });
      });
    }
  }
}

export function captureException(exception: any) {
  Sentry.captureException(exception);
}
