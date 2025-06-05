import { getWeekDays } from "./getWeekDays";

describe("getWeekDays", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 5, 4, 0, 0, 0));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns 7 days starting from Sunday by default for a mid-week date", () => {
    const date = new Date(2025, 5, 4, 15, 30);
    const week = getWeekDays(date);

    expect(week).toHaveLength(7);

    expect(week[0].dayOfMonth).toBe(1);
    expect(week[0].dayName).toBe("SUN");
    expect(week[0].isToday).toBe(false);

    expect(week[3].dayOfMonth).toBe(4);
    expect(week[3].dayName).toBe("WED");
    expect(week[3].isToday).toBe(true);

    expect(week[6].dayOfMonth).toBe(7);
    expect(week[6].dayName).toBe("SAT");
    expect(week[6].isToday).toBe(false);
  });

  it("respects weekStartDay = 1 (Monday) for the same date", () => {
    const date = new Date(2025, 5, 4, 8, 0);
    const week = getWeekDays(date, 1);

    expect(week).toHaveLength(7);

    expect(week[0].dayOfMonth).toBe(2);
    expect(week[0].dayName).toBe("MON");
    expect(week[0].isToday).toBe(false);

    expect(week[2].dayOfMonth).toBe(4);
    expect(week[2].dayName).toBe("WED");
    expect(week[2].isToday).toBe(true);

    expect(week[6].dayOfMonth).toBe(8);
    expect(week[6].dayName).toBe("SUN");
    expect(week[6].isToday).toBe(false);
  });

  it("correctly marks isToday only when date matches system today midnight", () => {
    const week = getWeekDays(new Date(2025, 5, 4, 0, 0));
    week.forEach((item) => {
      const date = new Date(item.date);
      const isSameDay =
        date.getFullYear() === 2025 &&
        date.getMonth() === 5 &&
        date.getDate() === 4;
      expect(item.isToday).toBe(isSameDay);
    });
  });
});
