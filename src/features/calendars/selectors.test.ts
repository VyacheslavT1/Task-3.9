import { selectVisibleCalendarIds, selectCalendarColor } from "./selectors";

type Calendar = {
  id: string;
  title: string;
  color: string;
  visible: boolean;
};
type RootState = {
  auth: any;
  weekView: any;
  day: any;
  calendars: {
    calendars: Calendar[];
  };
};

describe("calendars selectors", () => {
  it("should return visible calendar ids", () => {
    const state: RootState = {
      auth: {},
      weekView: {},
      day: {},
      calendars: {
        calendars: [
          { id: "1", title: "A", color: "#fff", visible: true },
          { id: "2", title: "B", color: "#000", visible: false },
          { id: "3", title: "C", color: "#123", visible: true },
        ],
      },
    };
    expect(selectVisibleCalendarIds(state)).toEqual(["1", "3"]);
  });

  it("should return calendar color map", () => {
    const state: RootState = {
      auth: {},
      weekView: {},
      day: {},
      calendars: {
        calendars: [
          { id: "1", title: "A", color: "#fff", visible: true },
          { id: "2", title: "B", color: "#000", visible: false },
        ],
      },
    };
    expect(selectCalendarColor(state)).toEqual({
      "1": "#fff",
      "2": "#000",
    });
  });

  it("should return empty array/object if no calendars", () => {
    const state: RootState = {
      auth: {},
      weekView: {},
      day: {},
      calendars: {
        calendars: [],
      },
    };
    expect(selectVisibleCalendarIds(state)).toEqual([]);
    expect(selectCalendarColor(state)).toEqual({});
  });
});
