const otaClient = require('@crowdin/ota-client');
const _ = require("lodash");
const fs = require("fs");

// this read only hash is from crowdin
const hash = 'cf849610ca66250f0954379ct4t';

const client = new otaClient.default(hash);

async function main() {
  const [
    languagesList,
    translationsRaw,
  ] = await Promise.all([
    client.getLanguageObjects(),
    client.getStrings(),
  ]);

  const lang = languagesList.reduce((map, lang) => {
    map[lang.id] = lang.name;
    return map;
  }, {});

  const translations = languagesList.reduce((map, langRaw) => {
    map[langRaw.id] = {
      lang,
    }
    const translation = translationsRaw[langRaw.id];
    for(const k in translation) {
      const key = [langRaw.id, k].join(".");
      _.set(map, key, translation[k]);
    }
    return map;
  }, {});

  await fs.writeFileSync("translations.json", JSON.stringify(translations, null, 2), "utf-8");
}

main();