import { app } from "electron";
import axios from "axios";
import path from "path";
import * as log from "electron-log";
import bcrypt from "bcryptjs";
import { createReadStream, statSync } from "fs";
import { deepReadDir } from "./tea-dir";
import fetch from "node-fetch";

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

export async function syncLogsAt(prefix: string) {
	const logDir = path.join(app.getPath("home"), "Library/Logs/tea");
	// ['/Users/neil/Library/Logs/tea/main.log']
	const logFiles = await deepReadDir({ dir: logDir });
	const files = logFiles.map((p) => {
		const paths = p.split("/");
		return paths.pop();
	});

	const signedUrls = await post<{ [key: string]: string }>(`/gui/${prefix}/sync-log-files`, {
		files
	});
	if (signedUrls) {
		for (const key in signedUrls) {
			const fileIndex = files.indexOf(key);
			const filePath = logFiles[fileIndex];
			if (filePath) {
				const payload = createReadStream(filePath);
				const response = await fetch(signedUrls[key], {
					method: "PUT",
					body: payload,
					headers: {
						"Content-Length": statSync(filePath).size.toString()
					}
				});
				log.info("uploading log:", key, response.status);
			}
		}
	}
}

export default get;
