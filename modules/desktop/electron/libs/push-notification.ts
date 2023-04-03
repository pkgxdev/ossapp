import Pushy from "pushy-electron";
import { readSessionData } from "./auth";
import { post } from "./v1-client";
import * as log from "electron-log";
import { BrowserWindow } from "electron";
import { nameToSlug } from "./package";
import {
	getInstalledPackages,
	getPackagesInstalledList,
	updatePackageInstalledList
} from "./tea-dir";

export default function initialize(mainWindow: BrowserWindow) {
	Pushy.listen();
	// Register device for push notifications
	Pushy.register({ appId: "64110fb47446e48a2a0e906d" })
		.then(async (push_token) => {
			const { device_id } = await readSessionData();
			if (device_id) await post(`/auth/device/${device_id}/register-push-token`, { push_token });
		})
		.catch((err) => {
			log.error(err);
			// Display error dialog
			// Pushy.alert(mainWindow, 'Pushy registration error: ' + err.message);
		});

	// Listen for incoming notifications
	Pushy.setNotificationListener((data: any) => {
		// Display an alert with the "message" payload value
		log.info("push data:", data);
		// TODO: replace this with something
		Pushy.alert(mainWindow, data?.message as string);
	});
}

export async function subscribeToPackageTopic(pkgFullname: string) {
	try {
		if (Pushy.isRegistered()) {
			const slug = nameToSlug(pkgFullname);
			const topic = `packages-${slug}`;
			await Pushy.subscribe(topic);
			log.info("push: registered to pkg-topic: ", topic);
		} else {
			log.info("pushy is not registered");
		}
	} catch (error) {
		log.error(error);
	}
}

export async function unsubscribeToPackageTopic(pkgFullname: string) {
	try {
		if (Pushy.isRegistered()) {
			const slug = nameToSlug(pkgFullname);
			const topic = `packages-${slug}`;
			await Pushy.unsubscribe(topic);
			log.info("push: unregistered from pkg-topic: ", topic);
		} else {
			log.info("pushy is not registered");
		}
	} catch (error) {
		log.error(error);
	}
}

export async function syncPackageTopicSubscriptions() {
	try {
		log.info("syncing package topic subscriptions");
		const [installedPackages, lastInstalledList] = await Promise.all([
			getInstalledPackages(),
			getPackagesInstalledList()
		]);

		const previouslyInstalledNames = lastInstalledList.map((pkg) => pkg.full_name);
		const currentlyInstalledNames = installedPackages.map((pkg) => pkg.full_name);

		const subscribedTo = currentlyInstalledNames.filter(
			(pkg) => !previouslyInstalledNames.includes(pkg)
		);
		const unsubscribedFrom = previouslyInstalledNames.filter(
			(pkg) => !currentlyInstalledNames.includes(pkg)
		);

		for (const subscribe of subscribedTo) {
			await subscribeToPackageTopic(subscribe);
		}
		for (const unsubscribe of unsubscribedFrom) {
			await unsubscribeToPackageTopic(unsubscribe);
		}

		await updatePackageInstalledList(installedPackages);
	} catch (error) {
		log.error(error);
	}
}
