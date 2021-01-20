import { fmtChronographRelative } from "@/filter/fmtChronograph";

describe("fmtChronographRelative", () => {
  it("should format 25 seconds ago for en", () => {
    const datePlusOneHour = new Date().getTime() - 25 * 1000; // 25 seconds
    const result = fmtChronographRelative(new Date(datePlusOneHour), "en");
    expect(result).toEqual("25 seconds ago");
  });

  it("should format 1 minute ago for en", () => {
    const datePlusOneHour = new Date().getTime() - 65 * 1000; // 1 minute 5 seconds
    const result = fmtChronographRelative(new Date(datePlusOneHour), "en");
    expect(result).toEqual("1 minute ago");
  });

  it("should format one hour ago for en", () => {
    const datePlusOneHour = new Date().getTime() - 61 * 60 * 1000; // 1 hour and 1 minute
    const result = fmtChronographRelative(new Date(datePlusOneHour), "en");
    expect(result).toEqual("1 hour ago");
  });

  it("should format one hour ago for de", () => {
    const datePlusOneHour = new Date().getTime() - 61 * 60 * 1000;
    const result = fmtChronographRelative(new Date(datePlusOneHour), "de");
    expect(result).toEqual("vor 1 Stunde");
  });
});
