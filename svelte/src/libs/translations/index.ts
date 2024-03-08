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
import no from "./languages/no.json";
import hr from "./languages/hr.json";
import ja from "./languages/ja.json";
import lt from "./languages/lt.json";
import kr from "./languages/kr.json";
import es from "./languages/es.json";
import fi from "./languages/fi.json";
import si from "./languages/si.json";
import nl from "./languages/nl.json";
import bg from "./languages/bg.json";
import vi from "./languages/vi.json";
import by from "./languages/by.json";
import ie from "./languages/ie.json";
import th from "./languages/th.json";
import kz from "./languages/kz.json";
import gr from "./languages/gr.json";
import ms from "./languages/ms.json";
import id from "./languages/id.json";
import sk from "./languages/sk.json";
import srb from "./languages/srb.json";

import * as customModifiers from "./modifiers";

type Language = { [lang: string]: string };
type Translation = typeof en.translations & {
  lang: Language;
  [key: string]: any;
};

// add new language json object here
const languages = [
  en,
  zh,
  de,
  ru,
  uk,
  ptbr,
  pl,
  cz,
  lv,
  ro,
  it,
  se,
  fr,
  tr,
  no,
  hr,
  ja,
  lt,
  kr,
  es,
  fi,
  si,
  nl,
  bg,
  vi,
  by,
  ie,
  th,
  kz,
  gr,
  ms,
  id,
  sk,
  srb
];

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
