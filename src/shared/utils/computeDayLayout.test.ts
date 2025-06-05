import { computeDayLayout } from "./computeDayLayout";

const CELL_HEIGHT = 80;
const MIN_HEIGHT_WITH_END_TIME = CELL_HEIGHT / 2;
const MIN_HEIGHT_WITHOUT_END_TIME = CELL_HEIGHT / 4;

describe("computeDayLayout", () => {
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

  it("places two non-overlapping events each in a single column", () => {
    const firstEvent = {
      ...baseEvent,
      id: "event1",
      startTime: "09:00",
      endTime: "10:00",
    };
    const secondEvent = {
      ...baseEvent,
      id: "event2",
      startTime: "11:00",
      endTime: "12:00",
    };

    const positionedEvents = computeDayLayout(
      [firstEvent, secondEvent],
      CELL_HEIGHT
    );

    expect(positionedEvents).toHaveLength(2);

    const positionedFirstEvent = positionedEvents.find(
      (e) => e.id === "event1"
    )!;
    const positionedSecondEvent = positionedEvents.find(
      (e) => e.id === "event2"
    )!;

    expect(positionedFirstEvent.columns).toBeGreaterThanOrEqual(1);
    expect(positionedFirstEvent.column).toBe(0);
    expect(positionedSecondEvent.columns).toBeGreaterThanOrEqual(1);
    expect(positionedSecondEvent.column).toBe(0);

    expect(positionedFirstEvent.height).toBeGreaterThanOrEqual(
      MIN_HEIGHT_WITH_END_TIME
    );
    expect(positionedSecondEvent.height).toBeGreaterThanOrEqual(
      MIN_HEIGHT_WITH_END_TIME
    );
  });

  it("stacks two overlapping events into columns and orders them by descending end time", () => {
    const eventA = {
      ...baseEvent,
      id: "eventA",
      startTime: "09:00",
      endTime: "11:00",
    };
    const eventB = {
      ...baseEvent,
      id: "eventB",
      startTime: "09:30",
      endTime: "10:30",
    };

    const positionedEvents = computeDayLayout([eventA, eventB], CELL_HEIGHT);

    expect(positionedEvents).toHaveLength(2);

    const positionedEventA = positionedEvents.find((e) => e.id === "eventA")!;
    const positionedEventB = positionedEvents.find((e) => e.id === "eventB")!;

    expect(positionedEventA.columns).toBeGreaterThanOrEqual(1);
    expect(positionedEventB.columns).toBeGreaterThanOrEqual(1);

    expect(positionedEvents.map((e) => e.id)).toEqual(["eventA", "eventB"]);
  });

  it("enforces minimum height for very short events with endTime", () => {
    const shortDurationEvent = {
      ...baseEvent,
      id: "shortEvent",
      startTime: "10:00",
      endTime: "10:10",
    };

    const positionedEvents = computeDayLayout(
      [shortDurationEvent],
      CELL_HEIGHT
    );

    expect(positionedEvents).toHaveLength(1);
    const positionedShortEvent = positionedEvents[0];

    expect(positionedShortEvent.height).toBeCloseTo(MIN_HEIGHT_WITH_END_TIME);
  });

  it("uses minimum height for events without endTime", () => {
    const noEndTimeEvent = {
      ...baseEvent,
      id: "noEndEvent",
      startTime: "14:00",
      endTime: "",
    };

    const positionedEvents = computeDayLayout([noEndTimeEvent], CELL_HEIGHT);

    expect(positionedEvents).toHaveLength(1);
    const positionedNoEndEvent = positionedEvents[0];

    expect(positionedNoEndEvent.height).toBeCloseTo(
      MIN_HEIGHT_WITHOUT_END_TIME
    );
  });

  it("handles multiple windows of overlapping and non-overlapping events correctly", () => {
    const window1Event1 = {
      ...baseEvent,
      id: "window1Event1",
      startTime: "08:00",
      endTime: "09:00",
    };
    const window1Event2 = {
      ...baseEvent,
      id: "window1Event2",
      startTime: "08:30",
      endTime: "09:30",
    };
    const window2Event = {
      ...baseEvent,
      id: "window2Event",
      startTime: "10:00",
      endTime: "11:00",
    };

    const positionedEvents = computeDayLayout(
      [window1Event1, window1Event2, window2Event],
      CELL_HEIGHT
    );

    expect(positionedEvents).toHaveLength(3);

    const idsInOrder = positionedEvents.map((e) => e.id);
    expect(idsInOrder).toEqual([
      "window1Event1",
      "window1Event2",
      "window2Event",
    ]);

    const positionedWindow1Event1 = positionedEvents.find(
      (e) => e.id === "window1Event1"
    )!;
    const positionedWindow1Event2 = positionedEvents.find(
      (e) => e.id === "window1Event2"
    )!;

    expect(positionedWindow1Event1.columns).toBeGreaterThanOrEqual(1);
    expect(positionedWindow1Event2.columns).toBeGreaterThanOrEqual(1);
  });
});
