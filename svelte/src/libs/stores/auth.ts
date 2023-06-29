import { writable } from "svelte/store";

import { listenToChannel } from "@native";
import type { Developer } from "$libs/types";
import type { Session } from "$libs/types";
import { getSession as electronGetSession, updateSession as electronUpdateSession } from "@native";
import { initSentry } from "../sentry";
import log from "$libs/logger";

export let session: Session | null = null;
export const getSession = async (): Promise<Session | null> => {
  session = await electronGetSession();
  return session;
};

export default function initAuthStore() {
  const user = writable<Developer | undefined>();
  const sessionStore = writable<Session>({});

  const deviceIdStore = writable<string>("");
  let deviceId = "";

  getSession().then((sess) => {
    if (sess) {
      session = sess;
      initSentry(sess);
      sessionStore.set(sess);
      deviceIdStore.set(sess.device_id!);
      deviceId = sess.device_id!;
      if (sess.user) user.set(sess.user);
    }
  });

  listenToChannel("session-update", (data: Session) => {
    log.info("session update renderer", data);
    sessionStore.update((val) => ({
      ...val,
      ...data
    }));
    if (data.user) {
      user.set(data.user);
    }
  });

  async function updateSession(data: Session) {
    sessionStore.update((val) => ({
      ...val,
      ...data
    }));

    initSentry(data);
    await electronUpdateSession(data);
  }

  function clearSession() {
    updateSession({ key: undefined, user: undefined });
    user.set(undefined);
  }

  return {
    user,
    session: sessionStore,
    deviceId,
    deviceIdStore,
    clearSession,
    updateSession
  };
}
