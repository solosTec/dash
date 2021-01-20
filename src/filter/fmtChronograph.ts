export const fmtChronograph = (value: Date): string => {
  if (!value) {
    return "";
  }
  const date = new Date(0);
  date.setMilliseconds(new Date().getTime() - value.getTime());
  return date.toISOString().substr(11, 8);
};

export const fmtChronographWithDateTime = (value: Date): string => {
  if (!value) {
    return "";
  }
  const date = new Date(0);
  date.setMilliseconds(new Date().getTime() - value.getTime());
  return value.toUTCString() + " (" + date.toISOString().substr(11, 8) + ")";
};

const units: { [key: string]: number } = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
};

export const fmtChronographRelative = (value: Date, locale: string): string => {
  if (!value) {
    return "";
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
  // works in Chrome and FF
  // @ts-ignore typescript did not know about RelativeTimeFormat
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const elapsed = value.getTime() - new Date().getTime();

  for (let u in units) {
    if (Math.abs(elapsed) > units[u] || u == "second") {
      return rtf.format(Math.round(elapsed / units[u]), u);
    }
  }

  return "";
};
