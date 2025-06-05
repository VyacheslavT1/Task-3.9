import reducer, {
  shiftWeekByDays,
  setCurrentWeekDays,
  WeekState,
} from "./weekSlice";

jest.mock("shared/utils/getWeekDays", () => ({
  getWeekDays: (date: Date) => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(date.getTime());
      dateObj.setDate(dateObj.getDate() + i);
      result.push({
        date: dateObj.toISOString(),
        dayOfMonth: dateObj.getDate(),
        dayName: `Day${i + 1}`,
      });
    }
    return result;
  },
}));

describe("weekSlice", () => {
  it("should return initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(Array.isArray(state.currentWeekDays)).toBe(true);
    expect(state.currentWeekDays.length).toBe(7);
  });

  it("should set currentWeekDays with setCurrentWeekDays", () => {
    const initial: WeekState = {
      currentWeekDays: [],
    };
    const fakeWeek: any = [
      { date: "2025-05-19", dayOfMonth: 19, dayName: "Mon" },
      { date: "2025-05-20", dayOfMonth: 20, dayName: "Tue" },
    ];
    const result = reducer(initial, setCurrentWeekDays(fakeWeek));
    expect(result.currentWeekDays).toBe(fakeWeek);
  });

  it("should shift week by days with shiftWeekByDays", () => {
    const baseDate = new Date("2025-05-19");
    const currentWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate.getTime());
      date.setDate(date.getDate() + i);
      currentWeek.push({
        date: date.toISOString(),
        dayOfMonth: date.getDate(),
        dayName: `Day${i + 1}`,
      });
    }
    const initial: WeekState = { currentWeekDays: currentWeek };
    const result = reducer(initial, shiftWeekByDays(7));
    expect(result.currentWeekDays[0].date).toBe(
      new Date("2025-05-26").toISOString()
    );
    expect(result.currentWeekDays.length).toBe(7);
  });
});
