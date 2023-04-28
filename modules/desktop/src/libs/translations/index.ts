import i18n from "sveltekit-i18n";
import translations from "./translations.json";

/** @type {import('sveltekit-i18n').Config} */
const config = {
  initLocale: "en",
  fallbackLocale: "en",
  translations
};

export const { t, l, locales, locale } = new i18n(config);
