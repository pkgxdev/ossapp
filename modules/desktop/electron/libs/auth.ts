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

async function createInitialSessionFile(): Promise<Session> {
	let session = {
		...sessionMemory
	};
	try {
		const locale = app.getLocale();
		if (fs.existsSync(sessionFilePath)) {
			log.info("session file exists!");
			const sessionBuffer = await fs.readFileSync(sessionFilePath);
			session = JSON.parse(sessionBuffer.toString()) as Session;
			session.locale = locale;
		} else {
			log.info("session file does not exists!");
			await mkdirp(sessionFolder);
			const data = {
				device_id: await getDeviceId(),
				locale
			};
			await writeSessionData(data);
		}
	} catch (error) {
		log.error(error);
	}
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
		log.info("use session cache");
		return sessionMemory;
	}

	try {
		log.info("reading session data");
		const locale = app.getLocale();
		const sessionBuffer = await fs.readFileSync(sessionFilePath);
		const session = JSON.parse(sessionBuffer.toString()) as Session;
		session.locale = locale;
		sessionMemory = session;
		log.info("read session data");
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
