export const fmtChronograph = (value: Date): string => {
  if (!value) {
    return "";
  }
  const date = new Date(0);
  date.setMilliseconds(new Date().getTime() - value.getTime());
  return date.toISOString().substr(11, 8);
};
