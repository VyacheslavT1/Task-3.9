import getDaysInMonth from "./getDaysInMonth";

describe("getDaysInMonth", () => {
  it("should return correct days for a given month", () => {
    const testDate = new Date(2025, 2, 1);
    const days = getDaysInMonth(testDate);

    expect(days.length % 7).toBe(0);

    const currentMonth = testDate.getMonth();

    days.forEach((dayItem) => {
      if (dayItem.date.getMonth() === currentMonth) {
        expect(dayItem.disabled).toBe(false);
      }
      if (dayItem.date.getMonth() !== currentMonth) {
        expect(dayItem.disabled).toBe(true);
      }
    });
  });

  it("should start from the correct date", () => {
    const date = new Date(2025, 2, 1);
    const days = getDaysInMonth(date);

    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      1 - firstDayOfMonth.getDay()
    );
    expect(days[0].date.getTime()).toBe(startDate.getTime());
  });

  it("should return consecutive dates", () => {
    const date = new Date(2025, 2, 1);
    const days = getDaysInMonth(date);
    for (let i = 1; i < days.length; i++) {
      const prevDate = days[i - 1].date;
      const currDate = days[i].date;
      const diffDays = Math.ceil(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diffDays).toBe(1);
    }
  });

  it("should have correct number of current month days", () => {
    const date = new Date(2025, 2, 1);
    const days = getDaysInMonth(date);
    const currentMonthDaysCount = days.filter((day) => !day.disabled).length;
    const expectedDaysCount = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    expect(currentMonthDaysCount).toBe(expectedDaysCount);
  });
  it("should work correctly for February in a leap year", () => {
    const date = new Date(2024, 1, 1);
    const days = getDaysInMonth(date);
    const currentMonthDaysCount = days.filter((day) => !day.disabled).length;
    expect(currentMonthDaysCount).toBe(29);
  });
});
