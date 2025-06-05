import { computeWeekLayout } from "./computeWeekLayout";

const CELL_HEIGHT = 80;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR;
const TOTAL_HEIGHT = CELL_HEIGHT * HOURS_IN_DAY;
const MIN_HEIGHT_WITH_END_TIME = CELL_HEIGHT / 2;
const MIN_HEIGHT_WITHOUT_END_TIME = CELL_HEIGHT / 4;

describe("computeWeekLayout", () => {
  const baseEvent = {
    id: "",
    title: "",
    date: "2025-06-04",
    calendarId: "calendar-1",
    repeat: "none",
    allDay: false,
    description: "",
    uid: "user-1",
    timestamp: 0,
  };

  it("places two non-overlapping events in a single column without trimming", () => {
    const firstEvent = {
      ...baseEvent,
      id: "event1",
      startTime: "8:00 AM",
      endTime: "9:00 AM",
    };
    const secondEvent = {
      ...baseEvent,
      id: "event2",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
    };

    const positioned = computeWeekLayout(
      [firstEvent, secondEvent],
      CELL_HEIGHT
    );

    expect(positioned).toHaveLength(2);

    const pos1 = positioned.find((e) => e.id === "event1")!;
    const pos2 = positioned.find((e) => e.id === "event2")!;

    expect(pos1.columns).toBe(1);
    expect(pos1.column).toBe(0);
    expect(pos2.columns).toBe(1);
    expect(pos2.column).toBe(0);

    const startMin1 = 8 * MINUTES_IN_HOUR;
    const startMin2 = 10 * MINUTES_IN_HOUR;

    const expectedTop1 = (startMin1 / MINUTES_IN_DAY) * TOTAL_HEIGHT;
    const expectedHeight1 = (MINUTES_IN_HOUR / MINUTES_IN_DAY) * TOTAL_HEIGHT;
    const expectedTop2 = (startMin2 / MINUTES_IN_DAY) * TOTAL_HEIGHT;

    expect(pos1.height).toBeCloseTo(expectedHeight1);
    expect(pos2.height).toBeCloseTo(expectedHeight1);
    expect(pos1.top).toBeCloseTo(expectedTop1);
    expect(pos2.top).toBeCloseTo(expectedTop2);
    expect(pos1.top + pos1.height).toBeLessThanOrEqual(pos2.top);
  });

  it("stacks two partially overlapping events into separate columns and trims the first", () => {
    const eventA = {
      ...baseEvent,
      id: "eventA",
      startTime: "9:00 AM",
      endTime: "11:00 AM",
    };
    const eventB = {
      ...baseEvent,
      id: "eventB",
      startTime: "9:30 AM",
      endTime: "10:30 AM",
    };

    const positioned = computeWeekLayout([eventA, eventB], CELL_HEIGHT);

    expect(positioned).toHaveLength(2);

    const posA = positioned.find((e) => e.id === "eventA")!;
    const posB = positioned.find((e) => e.id === "eventB")!;

    expect(posA.columns).toBe(2);
    expect(posB.columns).toBe(2);
    expect(posA.column).toBe(0);
    expect(posB.column).toBe(1);

    const startMinA = 9 * MINUTES_IN_HOUR;
    const startMinB = 9 * MINUTES_IN_HOUR + 30;
    const endMinB = 10 * MINUTES_IN_HOUR + 30;

    const expectedTopA = (startMinA / MINUTES_IN_DAY) * TOTAL_HEIGHT;
    const expectedTopB = (startMinB / MINUTES_IN_DAY) * TOTAL_HEIGHT;
    const trimmedHeightA = expectedTopB - expectedTopA;
    const expectedHeightB =
      ((endMinB - startMinB) / MINUTES_IN_DAY) * TOTAL_HEIGHT;

    expect(posA.height).toBeCloseTo(trimmedHeightA);
    expect(posB.height).toBeCloseTo(expectedHeightB);
    expect(posA.top).toBeCloseTo(expectedTopA);
    expect(posB.top).toBeCloseTo(expectedTopB);
  });

  it("trims the height of an earlier event when a later event starts before it ends", () => {
    const event1 = {
      ...baseEvent,
      id: "event1",
      startTime: "8:00 AM",
      endTime: "10:00 AM",
    };
    const event2 = {
      ...baseEvent,
      id: "event2",
      startTime: "9:00 AM",
      endTime: "9:30 AM",
    };

    const positioned = computeWeekLayout([event1, event2], CELL_HEIGHT);

    expect(positioned).toHaveLength(2);

    const pos1 = positioned.find((e) => e.id === "event1")!;
    const pos2 = positioned.find((e) => e.id === "event2")!;

    const startMin1 = 8 * MINUTES_IN_HOUR;
    const startMin2 = 9 * MINUTES_IN_HOUR;
    const endMin2 = 9 * MINUTES_IN_HOUR + 30;

    const expectedTop1 = (startMin1 / MINUTES_IN_DAY) * TOTAL_HEIGHT;
    const expectedTop2 = (startMin2 / MINUTES_IN_DAY) * TOTAL_HEIGHT;
    const trimmedHeight1 = expectedTop2 - expectedTop1;
    const expectedHeight2 =
      ((endMin2 - startMin2) / MINUTES_IN_DAY) * TOTAL_HEIGHT;

    expect(pos1.height).toBeCloseTo(trimmedHeight1);
    expect(pos1.top + pos1.height).toBeCloseTo(pos2.top);
    expect(pos2.height).toBeCloseTo(expectedHeight2);
  });

  it("applies correct minimum heights for short and no-end events", () => {
    const shortEvent = {
      ...baseEvent,
      id: "shortEvent",
      startTime: "10:00 AM",
      endTime: "10:10 AM",
    };
    const noEndEvent = {
      ...baseEvent,
      id: "noEndEvent",
      startTime: "2:00 PM",
      endTime: "",
    };

    const positioned = computeWeekLayout([shortEvent, noEndEvent], CELL_HEIGHT);

    const posShort = positioned.find((e) => e.id === "shortEvent")!;
    const posNoEnd = positioned.find((e) => e.id === "noEndEvent")!;

    expect(posShort.height).toBeCloseTo(MIN_HEIGHT_WITH_END_TIME);
    expect(posNoEnd.height).toBeCloseTo(MIN_HEIGHT_WITHOUT_END_TIME);
  });

  it("correctly assigns column indices when three events overlap in complex patterns", () => {
    const ev1 = {
      ...baseEvent,
      id: "ev1",
      startTime: "8:00 AM",
      endTime: "9:00 AM",
    };
    const ev2 = {
      ...baseEvent,
      id: "ev2",
      startTime: "8:30 AM",
      endTime: "10:00 AM",
    };
    const ev3 = {
      ...baseEvent,
      id: "ev3",
      startTime: "9:00 AM",
      endTime: "9:30 AM",
    };

    const positioned = computeWeekLayout([ev1, ev2, ev3], CELL_HEIGHT);

    expect(positioned).toHaveLength(3);

    const pos1 = positioned.find((e) => e.id === "ev1")!;
    const pos2 = positioned.find((e) => e.id === "ev2")!;
    const pos3 = positioned.find((e) => e.id === "ev3")!;

    expect(pos1.columns).toBe(2);
    expect(pos2.columns).toBe(2);
    expect(pos1.column).toBe(0);
    expect(pos2.column).toBe(1);
    expect(pos3.column).toBe(0);
    expect(pos3.columns).toBe(2);
  });
});
