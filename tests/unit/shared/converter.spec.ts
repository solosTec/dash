import { Converter } from "@/shared/converter";

describe("Converter", () => {
  describe("mapTimeStampToHHMMSS", () => {
    it("should let undefined as untouched", () => {
      const result = Converter.mapTimeStampToHHMMSS(undefined as any);
      expect(result).toBeUndefined();
    });
    it("should let null as untouched", () => {
      const result = Converter.mapTimeStampToHHMMSS(null as any);
      expect(result).toBeNull();
    });
    it("should let the format HH:MM:SS untouched", () => {
      const result = Converter.mapTimeStampToHHMMSS("00:00:00");
      expect(result).toEqual("00:00:00");
    });
    it("should convert the format HH:MM:S to HH:MM:SS", () => {
      const result = Converter.mapTimeStampToHHMMSS("00:00:0");
      expect(result).toEqual("00:00:00");
    });
    it("should cut of miliseconds", () => {
      const result = Converter.mapTimeStampToHHMMSS("00:00:00.000");
      expect(result).toEqual("00:00:00");
    });
    it("should convert 00:10:0.000000 to 00:10:00", () => {
      const result = Converter.mapTimeStampToHHMMSS("00:10:0.00000");
      expect(result).toEqual("00:10:00");
    });
    it("should convert 00:10:1.000000 to 00:10:01", () => {
      const result = Converter.mapTimeStampToHHMMSS("00:10:1.00000");
      expect(result).toEqual("00:10:01");
    });
    it("should not touch any unexpected string", () => {
      const result = Converter.mapTimeStampToHHMMSS("aa");
      expect(result).toEqual("aa");
    });
  });
});
