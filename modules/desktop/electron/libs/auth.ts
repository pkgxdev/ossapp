import { mkdirp } from "mkdirp";
import path from "path";
import fs from "fs";
import { getTeaPath } from "./tea-dir";
import * as v1Client from "./v1-client";
import { app } from "electron";
import * as log from "electron-log";

const sessionFilePath = path.join(getTeaPath(), "tea.xyz/gui/tmp.dat");
const sessionFolder = path.join(getTeaPath(), "tea.xyz/gui");

export interface Session {
	device_id?: string;
	key?: string;
	user?: any;
	locale?: string;
}

export async function readSessionData(): Promise<Session> {
	const locale = app.getLocale();
	try {
		log.info("reading session data");
		const sessionBuffer = await fs.readFileSync(sessionFilePath);
		const session = JSON.parse(sessionBuffer.toString()) as Session;
		session.locale = locale;
		return session;
	} catch (error) {
		log.error(error);
		log.info("requesting device_id");
		const req = await v1Client.get<{ deviceId: string }>("/auth/registerDevice");
		const data = { device_id: req.deviceId, locale };
		log.info("got device_id", data);
		await writeSessionData(data);
		return data;
	}
}

export async function writeSessionData(data: Session) {
	try {
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
