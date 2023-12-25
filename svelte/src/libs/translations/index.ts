import i18n from "@sveltekit-i18n/base";
import parser from "@sveltekit-i18n/parser-default";
import type { Config } from "@sveltekit-i18n/parser-default";

// import new languages json here
import en from "./languages/en.json";
import de from "./languages/de.json";
import ru from "./languages/ru.json";
import uk from "./languages/uk.json";
import zh from "./languages/zh.json";
import ptbr from "./languages/ptbr.json";
import pl from "./languages/pl.json";
import cz from "./languages/cz.json";
import lv from "./languages/lv.json";
import ro from "./languages/ro.json";
import it from "./languages/it.json";
import se from "./languages/se.json";
import fr from "./languages/fr.json";
import tr from "./languages/tr.json";


import * as customModifiers from "./modifiers";

type Language = { [lang: string]: string };
type Translation = typeof en.translations & {
  lang: Language;
  [key: string]: any;
};

// add new language json object here

const languages = [en, zh, de, ru, uk, ptbr, pl, cz, lv, ro, it, se, fr, tr];

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

const config: Config<{
  // add params here for i18n strings ie: "say something {{say}}"
  // say?: string
  version?: string;
}> = {
  initLocale: "en",
  fallbackLocale: "en",
  fallbackValue: "",
  translations,
  parser: parser({
    customModifiers
  })
};

export const { t, l, locales, locale } = new i18n(config);
