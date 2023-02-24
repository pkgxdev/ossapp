// const { notarize } = require('@electron/notarize');
// const fs = require('fs');
// const path = require('path');

module.exports = {
	appId: "xyz.tea.gui",
	productName: "tea",
	asar: false,
	directories: { output: "dist" },
	files: ["electron/dist/electron.cjs", { from: "build", to: "" }],
	linux: {
		icon: "./icon.png"
	},
	mac: {
		target: {
			target: "default",
			arch: ["x64", "arm64"]
		}
	},
	// TODO: if xcrun altool exists eventually in our self-hosted macos
	// SOLUTION: is notarize separately in next pipeline step
	// afterSign: async (params) => {
	// 	if (process.platform !== 'darwin') {
	// 		return;
	// 	}

	// 	console.log('afterSign hook triggered', params);

	// 	const appBundleId = 'xyz.tea.gui';

	// 	let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
	// 	if (!fs.existsSync(appPath)) {
	// 		console.log('skip');
	// 		return;
	// 	}

	// 	console.log(`Notarizing ${appBundleId} found at ${appPath} with Apple ID ${process.env.APPLE_ID}`);

	// 	try {
	// 		await notarize({
	// 			appBundleId,
	// 			appPath,
	// 			appleId: process.env.APPLE_ID,
	// 			appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD
	// 		});
	// 	} catch (error) {
	// 		console.error(error);
	// 	}

	// 	console.log(`Done notarizing`);
	// },

	// publish: {
	// 	provider: "github",
	// 	repo: "gui",
	// 	owner: "teaxyz",
	// 	releaseType: "release"
	// },

	// this determines the configuration of the auto-update feature
	publish: {
		provider: "generic",
		// TODO: replace this with tea branded domain: gui-dist.tea.xyz
		// url: "https://d2ovumu63qzbn6.cloudfront.net/"
		url: "https://s3.amazonaws.com/preview.gui.tea.xyz/release"
	}
};
