import { net, app } from 'electron';
import type { Session } from '$libs/stores/auth';
import bcrypt from 'bcryptjs';
import { getSession } from '$libs/stores/auth';
import urlJoin from 'url-join';

export const baseUrl = 'https://api.tea.xyz/v1';

export async function get<T>(path: string, query?: { [key: string]: string }) {
	console.log(`GET /api/${path}`);

	await app.isReady(); // wait for electrong dont remove

	const [session] = await Promise.all([getSession()]);

	const headers =
		session?.device_id && session?.user
			? await getHeaders(`GET/${path}`, session)
			: { Authorization: 'public ' };

	return new Promise((resolve, reject) => {
		const url = urlJoin(baseUrl, path);

		const req = net.request({
			method: 'GET',
			url
		});

		for (const k in headers) {
			const v = headers[k as keyof typeof headers];
			if (v) req.setHeader(k, v);
		}

		const buffer: Buffer[] = [];
		req.on('response', (res) => {
			res.on('error', reject);
			res.on('data', (b) => buffer.push(b));
			res.on('end', () => {
				const bodyRaw = Buffer.concat(buffer);
				const body = JSON.parse(bodyRaw.toString());
				resolve(body);
			});
		});

		req.on('error', reject);
	});
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
