const fs = require("fs");
const _ = require("lodash");
const translations = require("../src/libs/translations/translations.json");
const axios = require("axios");

const token = process.env.CROWDIN_API_TOKEN;
const projectId = 570715;
const fileId = 7;
const headers = {
	Authorization: `Bearer ${token}`,
	"Content-Type": "application/json"
};

const englishRaw = translations["en"];

delete englishRaw.lang;

function flattenObject(o, prefix = "", result = {}, keepNull = true) {
	if (_.isString(o) || _.isNumber(o) || _.isBoolean(o) || (keepNull && _.isNull(o))) {
		result[prefix] = o;
		return result;
	}

	if (_.isArray(o) || _.isPlainObject(o)) {
		for (let i in o) {
			let pref = prefix;
			if (_.isArray(o)) {
				pref = pref + `[${i}]`;
			} else {
				if (_.isEmpty(prefix)) {
					pref = i;
				} else {
					pref = prefix + "." + i;
				}
			}
			flattenObject(o[i], pref, result, keepNull);
		}
		return result;
	}
	return result;
}

const flattenedEnglish = flattenObject(englishRaw);

const getStrings = async () => {
	const { data } = await axios({
		method: "GET",
		url: `https://api.crowdin.com/api/v2/projects/${projectId}/strings?limit=500`,
		headers
	});
	return data.data;
};

async function main() {
	const data = await getStrings();
	for (const key in flattenedEnglish) {
		const found = data.find((data) => data.data.identifier === `"${key}"`);
		if (found && found.data.text !== flattenedEnglish[key]) {
			console.log("update!", key, found.data.text, flattenedEnglish[key]);
			await updateString(found.data.id, flattenedEnglish[key]);
		} else if (!found) {
			// insert add
			await createString(key, flattenedEnglish[key]);
		}
	}
}

async function createString(key, text) {
	await axios({
		method: "POST",
		url: `https://api.crowdin.com/api/v2/projects/${projectId}/strings`,
		headers,
		data: {
			text,
			identifier: `"${key}"`,
			fileId,
			context: ` -> ${key}`,
			isHidden: false,
			maxLength: 0,
			labelIds: []
		}
	});
}

async function updateString(stringId, value) {
	const d = await axios({
		method: "PATCH",
		url: `https://api.crowdin.com/api/v2/projects/${projectId}/strings/${stringId}`,
		headers,
		data: [
			{
				value,
				op: "replace",
				path: "/text"
			}
		]
	});
}

main();
