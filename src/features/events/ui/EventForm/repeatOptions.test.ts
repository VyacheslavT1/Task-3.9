import { getRepeatOptions } from "./repeatOptions";

describe("getRepeatOptions", () => {
  it("should return options with empty weekday/month if date is null", () => {
    const options = getRepeatOptions(null);
    expect(options).toEqual([
      { value: "Does not repeat", label: "Does not repeat" },
      { value: "Daily", label: "Daily" },
      { value: "Weekly on ", label: "Weekly on " },
      { value: "Monthly", label: "Monthly" },
      { value: "Annually on ", label: "Annually on " },
    ]);
  });

  it("should return options with formatted date parts if date is provided", () => {
    const date = new Date("2025-06-01T12:00:00Z");
    const options = getRepeatOptions(date);
    expect(options).toEqual([
      { value: "Does not repeat", label: "Does not repeat" },
      { value: "Daily", label: "Daily" },
      { value: "Weekly on Sunday", label: "Weekly on Sunday" },
      { value: "Monthly", label: "Monthly" },
      { value: "Annually on June 1", label: "Annually on June 1" },
    ]);
  });

  it("should format weekday and month/day according to en-US locale", () => {
    const date = new Date("2025-05-30T12:00:00Z");
    const options = getRepeatOptions(date);
    expect(options[2]).toEqual({
      value: "Weekly on Friday",
      label: "Weekly on Friday",
    });
    expect(options[4]).toEqual({
      value: "Annually on May 30",
      label: "Annually on May 30",
    });
  });
});
