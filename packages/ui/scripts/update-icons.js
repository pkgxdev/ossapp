import https from 'https';
import fs from 'fs';
import path from 'path';

const fontasticDownloadURI = 'https://file.myfontastic.com/Fd33ifaooDVpESwnDXETgR/icons.css';
// i tried the zip dl unfortunately its auth protected so have to hack our way into the resources

const downloadFileTo = async (uri, path) => {
	return new Promise((resolve) => {
		const file = fs.createWriteStream(path);
		https.get(uri, (res) => {
			res.pipe(file);
			file.on('finish', () => {
				file.close();
				console.log(`downloaded: ${uri}`);
				resolve();
			});
		});
	});
};

async function main() {
	const tmpIconsCss = './scripts/icons.css';
	const iconsFolder = './src/icons/';
	await downloadFileTo(fontasticDownloadURI, tmpIconsCss); // works

	const cssFile = fs.readFileSync(tmpIconsCss, 'utf-8');

	const matches = cssFile.matchAll(/url\(.*?\)/gi);
	const [url] = matches.next().value;
	const fileVersion = url.split('/').pop().split('.')[0];

	const exts = ['eot', 'woff', 'ttf', 'svg'];

	for (const ext of exts) {
		const uri = `https://file.myfontastic.com/Fd33ifaooDVpESwnDXETgR/fonts/${fileVersion}.${ext}`;
		await downloadFileTo(uri, path.join(iconsFolder, `fonts/tea-icons.${ext}`));
	}

	const newCssFile = cssFile
		.replaceAll('https://file.myfontastic.com/Fd33ifaooDVpESwnDXETgR/', '')
		.replaceAll(fileVersion, 'tea-icons');
	await fs.writeFileSync(path.join(iconsFolder, 'icons.css'), newCssFile, { encoding: 'utf-8' });
}

main();
