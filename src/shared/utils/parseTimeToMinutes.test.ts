import { parseTimeToMinutes } from "./parseTimeToMinutes";

describe("parseTimeToMinutes", () => {
  it("should return 0 when time is undefined", () => {
    expect(parseTimeToMinutes(undefined)).toBe(0);
  });

  it('should parse "12 AM" as 0 minutes', () => {
    expect(parseTimeToMinutes("12 AM")).toBe(0);
  });

  it('should parse "12 PM" as 720 minutes', () => {
    expect(parseTimeToMinutes("12 PM")).toBe(12 * 60);
  });

  it('should parse "1 AM" as 60 minutes', () => {
    expect(parseTimeToMinutes("1 AM")).toBe(60);
  });

  it('should parse "1 PM" as 13 * 60 minutes (780)', () => {
    expect(parseTimeToMinutes("1 PM")).toBe(13 * 60);
  });

  it('should parse "11:30 AM" as 11 * 60 + 30 minutes (690)', () => {
    expect(parseTimeToMinutes("11:30 AM")).toBe(11 * 60 + 30);
  });

  it('should parse "11:30 PM" as 23 * 60 + 30 minutes (1410)', () => {
    expect(parseTimeToMinutes("11:30 PM")).toBe(23 * 60 + 30);
  });

  it('should parse "  7:05 pm  " with extra spaces and lowercase as 19 * 60 + 5 (1145)', () => {
    expect(parseTimeToMinutes("  7:05 pm  ")).toBe(19 * 60 + 5);
  });

  it("should return 0 for strings without AM/PM", () => {
    expect(parseTimeToMinutes("08:00")).toBe(0);
    expect(parseTimeToMinutes("8:00")).toBe(0);
    expect(parseTimeToMinutes("20:00")).toBe(0);
  });

  it("should return 0 for completely invalid formats", () => {
    expect(parseTimeToMinutes("invalid")).toBe(0);
    expect(parseTimeToMinutes("123 PM")).toBe(0);
    expect(parseTimeToMinutes("")).toBe(0);
  });
});
