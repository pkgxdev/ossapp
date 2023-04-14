import { mkdirp } from "mkdirp";
import path from "path";
import fs from "fs";
import { getTeaPath } from "./tea-dir";
import { app } from "electron";
import * as log from "electron-log";
import axios from "axios";

const sessionFilePath = path.join(getTeaPath(), "tea.xyz/gui/tmp.dat");
const sessionFolder = path.join(getTeaPath(), "tea.xyz/gui");

export interface Session {
	device_id?: string;
	key?: string;
	user?: any;
	locale?: string;
}

let sessionMemory: Session = { device_id: "", locale: "en" };
const initialized: Promise<Session> = new Promise((resolve, reject) => {
	try {
		log.info("initializing GUI session folder");
		createInitialSessionFile().then((newSession) => {
			resolve(newSession);
		});
	} catch (error) {
		log.error(error);
		reject(error);
	}
});

async function addEmptySessionFile(): Promise<Session> {
	const locale = app.getLocale();
	await mkdirp(sessionFolder);
	const data = {
		device_id: await getDeviceId(),
		locale
	};
	await writeSessionData(data);
	log.info("new session file created");
	return data;
}

export async function createInitialSessionFile(): Promise<Session> {
	// TODO: this looks nasty, refactor this
	// the app is too dependent that this function succeeds
	let session = {
		...sessionMemory
	};
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
		try {
			const newSession = await addEmptySessionFile();
			if (newSession) {
				session = newSession;
				session.locale = locale;
			}
		} catch (error) {
			log.error(error);
		}
	}

	sessionMemory = session;

	return session;
}

let deviceIdRetryCount = 0;
async function getDeviceId() {
	let deviceId = "";
	try {
		const req = await axios.get<{ deviceId: string }>("https://api.tea.xyz/v1/auth/registerDevice");
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
	const data = await initialized;
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
		session.locale = locale;
		sessionMemory = session;
		log.info("re-read session data done");
	} catch (error) {
		log.error(error);
	}
	return sessionMemory;
}

export async function writeSessionData(data: Session) {
	try {
		sessionMemory = {
			...sessionMemory,
			...data
		};

		if (!sessionMemory.device_id) throw new Error("writing without device_id is not allowed!");

		log.info("creating:", sessionFolder);
		await mkdirp(sessionFolder);
		log.info("writing session data:", data); // rm this
		await fs.writeFileSync(sessionFilePath, JSON.stringify(data), {
			encoding: "utf-8"
		});
	} catch (error) {
		log.error(error);
	}
}
