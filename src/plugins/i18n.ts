import VueI18n from "vue-i18n";
import Vue from "vue";
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from "@/constants/languages";
import en from "@/constants/en.json";
import de from "@/constants/de.json";
import fr from "@/constants/fr.json";
import ru from "@/constants/ru.json";

Vue.use(VueI18n);

const messages = {
  en,
  de,
  fr,
  ru
};

export const i18n = new VueI18n({
  locale: DEFAULT_LANGUAGE, // set locale
  fallbackLocale: FALLBACK_LANGUAGE,
  messages // set locale messages
});
