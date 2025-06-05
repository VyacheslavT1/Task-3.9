import { getHours } from "./getHours";

describe("getHours", () => {
  const testDate = new Date("2025-06-04T00:00:00");

  it("returns an array of 24  objects", () => {
    const hours = getHours(testDate);
    expect(hours).toHaveLength(24);
    hours.forEach((item) => {
      expect(item).toHaveProperty("date");
      expect(item).toHaveProperty("hour");
      expect(item.date).toBeInstanceOf(Date);
      expect(typeof item.hour).toBe("string");
    });
  });

  it("generates correct hour strings in order from 12 am to 11 pm", () => {
    const hours = getHours(testDate);
    const expectedStrings = [
      "12 am",
      "1 am",
      "2 am",
      "3 am",
      "4 am",
      "5 am",
      "6 am",
      "7 am",
      "8 am",
      "9 am",
      "10 am",
      "11 am",
      "12 pm",
      "1 pm",
      "2 pm",
      "3 pm",
      "4 pm",
      "5 pm",
      "6 pm",
      "7 pm",
      "8 pm",
      "9 pm",
      "10 pm",
      "11 pm",
    ];
    const actualStrings = hours.map((item) => item.hour);
    expect(actualStrings).toEqual(expectedStrings);
  });

  it("assigns the correct local date and hour for each HourItem", () => {
    const hours = getHours(testDate);
    hours.forEach((item, index) => {
      expect(item.date.getFullYear()).toBe(testDate.getFullYear());
      expect(item.date.getMonth()).toBe(testDate.getMonth());
      expect(item.date.getDate()).toBe(testDate.getDate());
      expect(item.date.getHours()).toBe(index);
      expect(item.date.getMinutes()).toBe(0);
      expect(item.date.getSeconds()).toBe(0);
      expect(item.date.getMilliseconds()).toBe(0);
    });
  });

  it("works for a non-midnight starting date by still generating that day's 24 hours at 0 minutes", () => {
    const customDate = new Date("2025-06-04T15:45:00");
    const hours = getHours(customDate);
    expect(hours).toHaveLength(24);

    const first = hours[0];
    expect(first.date.getFullYear()).toBe(customDate.getFullYear());
    expect(first.date.getMonth()).toBe(customDate.getMonth());
    expect(first.date.getDate()).toBe(customDate.getDate());
    expect(first.date.getHours()).toBe(0);
    expect(first.hour).toBe("12 am");

    const fifteenth = hours[15];
    expect(fifteenth.date.getFullYear()).toBe(customDate.getFullYear());
    expect(fifteenth.date.getMonth()).toBe(customDate.getMonth());
    expect(fifteenth.date.getDate()).toBe(customDate.getDate());
    expect(fifteenth.date.getHours()).toBe(15);
    expect(fifteenth.hour).toBe("3 pm");
  });
});
