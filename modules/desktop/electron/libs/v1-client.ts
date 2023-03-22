import axios from "axios";
import path from "path";
import * as log from "electron-log";
import bcrypt from "bcryptjs";

import { readSessionData, type Session } from "./auth";

const base = "https://api.tea.xyz";
const publicHeader = { Authorization: "public" };
export async function get<T>(urlPath: string) {
	try {
		log.info(`GET /v1/${urlPath}`);

		const session = await readSessionData();
		const headers =
			session?.device_id && session?.user
				? await getHeaders(`GET/${urlPath}`, session)
				: publicHeader;

		const url = new URL(path.join("v1", urlPath), base).toString();
		// TODO: add headers
		const req = await axios.request<T>({
			method: "GET",
			url,
			headers
		});

		log.info("REQUEST:", urlPath, req.status);

		return req.data;
	} catch (error) {
		log.error(error);
		return null;
	}
}

export async function post<T>(urlPath: string, data: { [key: string]: any }) {
	try {
		log.info(`POST /v1/${urlPath}`);

		const session = await readSessionData();
		const headers =
			session?.device_id && session?.user
				? await getHeaders(`GET/${urlPath}`, session)
				: publicHeader;

		const url = new URL(path.join("v1", urlPath), base).toString();
		const req = await axios.request<T>({
			method: "POST",
			url,
			headers,
			data
		});

		log.info("REQUEST:", urlPath, req.status);

		return req.data;
	} catch (error) {
		log.error(error);
		return null;
	}
}

async function getHeaders(path: string, session: Session) {
	const unixMs = new Date().getTime();
	const unixHexSecs = Math.round(unixMs / 1000).toString(16); // hex
	const deviceId = session.device_id?.split("-")[0];
	const preHash = [unixHexSecs, session.key, deviceId, path].join("");

	const Authorization = bcrypt.hashSync(preHash, 10);

	return {
		Authorization,
		["tea-ts"]: unixMs.toString(),
		["tea-uid"]: session.user?.developer_id,
		["tea-gui_id"]: session.device_id
	};
}

export default get;
