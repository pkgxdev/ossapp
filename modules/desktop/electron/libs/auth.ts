import { mkdirp } from "mkdirp";
import path from "path";
import fs from "fs";
import { getTeaPath } from "./tea-dir";
import * as v1Client from "./v1-client";
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
			const session = JSON.parse(sessionBuffer.toString()) as Session;
			session.locale = locale;
		} else {
			log.info("session file does not exists!");
			await mkdirp(sessionFolder);
			const req = await axios.get<{ deviceId: string }>(
				"https://api.tea.xyz/v1/auth/registerDevice"
			);
			const data = { device_id: "", locale };
			if (req && req.data.deviceId) {
				data.device_id = req.data.deviceId;
				log.info("got device_id", data);
				await writeSessionData(data);
			}
			session = data;
		}
	} catch (error) {
		log.error(error);
	}
	return session;
}

export async function readSessionData(): Promise<Session> {
	log.info("read session data.");
	const data = await initialized;
	log.info("initialized session exists:", !!data);
	if (sessionMemory) {
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
