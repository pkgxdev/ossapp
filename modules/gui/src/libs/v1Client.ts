import { getClient } from '@tauri-apps/api/http';
import type { Session } from '$libs/stores/auth';
import bcrypt from 'bcryptjs';
import { getSession } from '$libs/stores/auth';
import urlJoin from 'url-join';

export const baseUrl = 'https://api.tea.xyz/v1';

export async function get<T>(path: string, query?: { [key: string]: string }) {
	const [session, client] = await Promise.all([getSession(), getClient()]);

	const uri = urlJoin(baseUrl, path);

	const headers =
		session?.device_id && session?.user
			? await getHeaders(`GET/${path}`, session)
			: { Authorization: 'public ' };

	const { data } = await client.get<T>(uri.toString(), {
		headers,
		query: query || {}
	});
	return data;
}

async function getHeaders(path: string, session: Session) {
	const unixMs = new Date().getTime();
	const unixHexSecs = Math.round(unixMs / 1000).toString(16); // hex
	const deviceId = session.device_id?.split('-')[0];
	const preHash = [unixHexSecs, session.key, deviceId, path].join('');

	const Authorization = bcrypt.hashSync(preHash, 10);

	return {
		Authorization,
		['tea-ts']: unixMs.toString(),
		['tea-uid']: session.user?.developer_id,
		['tea-gui_id']: session.device_id
	};
}
