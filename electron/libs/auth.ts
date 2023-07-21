import { mkdirp } from "mkdirp";
import path from "path";
import fs from "fs";
import { getTeaPath } from "./tea-dir";
import { app } from "electron";
import log from "./logger";
import axios from "axios";
import get from "./v1-client";
import { DeviceAuth } from "../../svelte/src/libs/types";
import { notifyMainWindow } from "../electron";
import { InitWatcher } from "./initialize";
import { baseURL } from "./v1-client";
import { isDev } from "./auto-updater";

const sessionFilePath = path.join(getTeaPath(), `tea.xyz/gui/${isDev() ? "dev.dat" : "tmp.dat"}`);
const sessionFolder = path.join(getTeaPath(), "tea.xyz/gui");

export interface Session {
  device_id?: string;
  key?: string;
  user?: any;
  locale?: string;
  teaVersion?: string;
}

let sessionMemory: Session = { device_id: "", locale: "en" };

async function addEmptySessionFile(): Promise<Session> {
  const locale = app.getLocale();
  await mkdirp(sessionFolder);
  const data = {
    device_id: await getDeviceId(),
    locale
  };
  await writeSessionData(data, true);
  log.info("new session file created");
  return data;
}

async function createInitialSessionFile(): Promise<Session> {
  let session: Session = {};
  const locale = app.getLocale();

  try {
    if (fs.existsSync(sessionFilePath)) {
      log.info("session file exists!");
      const sessionBuffer = await fs.readFileSync(sessionFilePath);
      const sessionData = JSON.parse(sessionBuffer.toString()) as Session;

      if (!sessionData?.device_id) {
        throw new Error("device_id is empty!");
      } else {
        session = sessionData;
        session.locale = locale;
      }
    }
  } catch (error) {
    log.error(error);
  }

  if (!session?.device_id) {
    const newSession = await addEmptySessionFile();
    if (newSession) {
      session = newSession;
      session.locale = locale;
    }
  }

  sessionMemory = session;

  if (!session.device_id) throw new Error("device_id is empty!");

  return session;
}

let deviceIdRetryCount = 0;
async function getDeviceId() {
  let deviceId = "";
  try {
    const req = await axios.get<{ deviceId: string }>(`${baseURL}/v1/auth/registerDevice`);
    deviceId = req.data.deviceId;
  } catch (error) {
    log.error(error);
  }

  if (deviceIdRetryCount < 3 && !deviceId) {
    deviceIdRetryCount++;
    deviceId = await getDeviceId();
  }

  return deviceId;
}

export async function readSessionData(): Promise<Session> {
  log.info("read session data.");

  if (authFileState.getState() === "INITIALIZED" && !fs.existsSync(sessionFilePath)) {
    authFileState.reset();
  }
  const data = await authFileState.initialize();

  log.info(
    "initialized session device_id:",
    data?.device_id,
    "developer_id:",
    data?.user?.developer_id
  );
  if (sessionMemory?.device_id) {
    log.debug("use session cache");
    return sessionMemory;
  }

  try {
    log.info("re-reading session data");
    const locale = app.getLocale();
    const sessionBuffer = await fs.readFileSync(sessionFilePath);
    const session = JSON.parse(sessionBuffer.toString()) as Session;
    if (!session?.device_id) throw new Error("device_id is empty!");

    session.locale = locale;
    sessionMemory = session;
    log.info("re-read session data done");
  } catch (error) {
    authFileState.reset();
    sessionMemory = await authFileState.initialize();
    log.error(error);
  }
  return sessionMemory;
}

export async function writeSessionData(data: Session, force?: boolean) {
  try {
    const existingData = force ? sessionMemory : await readSessionData();
    sessionMemory = {
      ...existingData,
      ...data
    };

    if (!sessionMemory.device_id) throw new Error("writing without device_id is not allowed!");

    log.info("creating:", sessionFolder);
    await mkdirp(sessionFolder);
    log.info("writing session data:", sessionMemory); // rm this
    await fs.writeFileSync(sessionFilePath, JSON.stringify(sessionMemory), {
      encoding: "utf-8"
    });
  } catch (error) {
    log.error(error);
  }
}

let pollInterval: NodeJS.Timer | null;
let pollLoop = 0;
export async function pollAuth() {
  if (!pollInterval) {
    log.info("polling auth starts...");
    const session = await readSessionData();
    pollInterval = setInterval(async () => {
      pollLoop++;
      log.info("poll auth retry:", pollLoop);
      let clear = false;
      let success = false;
      try {
        const data = await get<DeviceAuth>(`/auth/device/${session.device_id}`);
        if (data?.status === "SUCCESS") {
          await writeSessionData({
            key: data.key,
            user: data.user
          });
          clear = true;
          success = true;
        } else if (pollLoop > 20 && pollInterval) {
          clear = true;
        }
      } catch (error) {
        log.error(error);
        clear = true;
      } finally {
        if (clear) {
          pollInterval && clearInterval(pollInterval);
          pollInterval = null;
          log.info("polling auth ends.");
        }
        if (success) {
          log.info("updating renderer session");
          notifyMainWindow("session-update", sessionMemory);
        }
      }
    }, 2000);
  }
}

export const authFileState = new InitWatcher<Session>(createInitialSessionFile);
authFileState.initialize();
