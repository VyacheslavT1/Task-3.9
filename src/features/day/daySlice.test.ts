import reducer, { setCurrentDate, shiftDateByDays, DayState } from "./daySlice";

describe("daySlice", () => {
  it("should return initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(typeof state.currentDate).toBe("number");
  });

  const initial: DayState = { currentDate: Date.UTC(2025, 5, 1) };
  const result = reducer(initial, setCurrentDate(Date.UTC(2025, 5, 5)));
  expect(result.currentDate).toBe(Date.UTC(2025, 5, 5));

  it("should shift date by days with shiftDateByDays", () => {
    const initial: DayState = { currentDate: Date.UTC(2025, 5, 1) };
    const result = reducer(initial, shiftDateByDays(3));
    const newDate = new Date(Date.UTC(2025, 5, 1));
    newDate.setDate(newDate.getDate() + 3);
    expect(result.currentDate).toBe(newDate.getTime());
  });

  it("should shift date by negative days with shiftDateByDays", () => {
    const initial: DayState = { currentDate: Date.UTC(2025, 5, 5) };
    const result = reducer(initial, shiftDateByDays(-2));
    const newDate = new Date(Date.UTC(2025, 5, 5));
    newDate.setDate(newDate.getDate() - 2);
    expect(result.currentDate).toBe(newDate.getTime());
  });
});
