import reducer, {
  setCalendars,
  clearVisibleCalendarIds,
  CalendarsState,
  Calendar,
} from "./calendarsSlice";

describe("calendarsSlice", () => {
  it("should return initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual({
      calendars: [],
    });
  });

  it("should set calendars with setCalendars action", () => {
    const calendars: Calendar[] = [
      { id: "1", title: "Work", color: "#fff", visible: true },
      { id: "2", title: "Personal", color: "#000", visible: false },
    ];
    const prevState: CalendarsState = { calendars: [] };
    const nextState = reducer(prevState, setCalendars(calendars));
    expect(nextState.calendars).toEqual(calendars);
  });

  it("should set all calendar visible flags to false with clearVisibleCalendarIds", () => {
    const calendars: Calendar[] = [
      { id: "1", title: "Work", color: "#fff", visible: true },
      { id: "2", title: "Personal", color: "#000", visible: true },
    ];
    const prevState: CalendarsState = { calendars };
    const nextState = reducer(prevState, clearVisibleCalendarIds());
    expect(nextState.calendars.every((cal) => cal.visible === false)).toBe(
      true
    );
  });
});
