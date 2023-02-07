import axios from 'axios';
import path from 'path';

const base = 'https://api.tea.xyz';
export async function get<T>(urlPath: string) {
	const url = new URL(path.join('v1', urlPath), base).toString();
	// TODO: add headers
	const req = await axios.request<T>({
		method: 'GET',
		url,
		headers: {}
	});

	return req.data;
}

export default get;
