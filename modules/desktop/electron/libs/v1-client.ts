import axios from "axios";
import path from "path";
import * as log from "electron-log";

const base = "https://api.tea.xyz";
export async function get<T>(urlPath: string) {
	const url = new URL(path.join("v1", urlPath), base).toString();
	// TODO: add headers
	const req = await axios.request<T>({
		method: "GET",
		url,
		headers: {}
	});

	log.info("REQUEST:", urlPath, req.status);

	return req.data;
}

export async function post<T>(urlPath: string, data: { [key: string]: any }) {
	const url = new URL(path.join("v1", urlPath), base).toString();
	const req = await axios.request<T>({
		method: "POST",
		url,
		headers: {},
		data
	});

	log.info("REQUEST:", urlPath, req.status);

	return req.data;
}

export default get;
