import VueI18n from "vue-i18n";

export const fmtPlaceholder = (value: VueI18n.TranslateResult): string => {
  return "<" + value + ">";
};
