import { toDateKey } from "./toDateKey";

describe("toDateKey", () => {
  it("converts a Date object to YYYY-MM-DD", () => {
    const date = new Date("2025-06-04T15:30:00");
    expect(toDateKey(date)).toBe("2025-06-04");
  });

  it("parses an ISO string to YYYY-MM-DD", () => {
    const isoString = "2025-07-15T00:00:00Z";
    expect(toDateKey(isoString)).toBe("2025-07-15");
  });

  it("uses toDate() method if provided on an object", () => {
    const wrapper = {
      toDate: () => new Date("2025-08-01T12:00:00"),
    };
    expect(toDateKey(wrapper)).toBe("2025-08-01");
  });

  it("falls back to new Date(value as string) for other inputs", () => {
    const invalidDate = "not-a-date";
    const result = toDateKey(invalidDate);
    expect(result).toBe("NaN-NaN-NaN");
  });
});
