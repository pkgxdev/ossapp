import i18n from "sveltekit-i18n";

// import new languages json here
import en from "./languages/en.json";

type Language = { [lang: string]: string };
type Translation = typeof en.translations & {
  lang: Language;
};

// add new language json object here
const languages = [en];

const langs: { [lang: string]: string } = {};
languages.forEach((lang) => {
  langs[lang.id] = lang.label;
});

const translations: {
  [id: string]: Translation;
} = {};

languages.forEach((l) => {
  translations[l.id] = {
    lang: langs,
    ...l.translations
  };
});

/** @type {import('sveltekit-i18n').Config} */
const config = {
  initLocale: "en",
  fallbackLocale: "en",
  translations
};

export const { t, l, locales, locale } = new i18n(config);
