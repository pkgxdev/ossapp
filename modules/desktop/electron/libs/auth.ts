import { mkdirp } from 'mkdirp';
import path from 'path';
import fs from 'fs';
import { getTeaPath } from './teaDir';
import * as v1Client from './v1Client';

const sessionFilePath = path.join(getTeaPath(), 'tea.xyz/gui/tmp.dat');
const sessionFolder = path.join(getTeaPath(), 'tea.xyz/gui');

interface Session {
	device_id?: string;
	key?: string;
	user?: any;
}

export async function initSessionData() {
	fs.readFileSync(sessionFilePath);

	await mkdirp(sessionFolder);
	const req = await v1Client.get<{ deviceId: string }>('/auth/registerDevice');
}

export async function readSessionData(): Promise<Session> {
	try {
		const sessionBuffer = await fs.readFileSync(sessionFilePath);
		const session = JSON.parse(sessionBuffer.toString()) as Session;
		return session;
	} catch (error) {
		console.error(error);
		const req = await v1Client.get<{ deviceId: string }>('/auth/registerDevice');
		const data = { device_id: req.deviceId };
		await writeSessionData(data);
		return data;
	}
}

export async function writeSessionData(data: Session) {
	try {
		await mkdirp(sessionFolder);
		await fs.writeFileSync(sessionFilePath, JSON.stringify(data), {
			encoding: 'utf-8'
		});
	} catch (error) {
		console.error(error);
	}
}
