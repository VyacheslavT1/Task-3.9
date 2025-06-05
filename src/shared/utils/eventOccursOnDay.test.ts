import { eventOccursOnDay } from "./eventOccursOnDay";

describe("eventOccursOnDay", () => {
  const baseEvent = {
    id: "1",
    title: "Test",
    calendarId: "cal1",
    timestamp: 0,
    description: "",
    uid: "u1",
  };

  it("does not show a daily event before its start date", () => {
    const ev = {
      ...baseEvent,
      date: "2025-05-20",
      repeat: "Daily",
      allDay: false,
    };
    expect(eventOccursOnDay(ev as any, new Date("2025-05-19"))).toBe(false);
  });

  it("shows a daily event after its start date", () => {
    const ev = {
      ...baseEvent,
      date: "2025-05-20",
      repeat: "Daily",
      allDay: false,
    };
    expect(eventOccursOnDay(ev as any, new Date("2025-05-22"))).toBe(true);
  });

  it("shows a weekly event on the same weekday as its start date", () => {
    const ev = {
      ...baseEvent,
      date: "2025-05-20", // Tuesday
      repeat: "Weekly on Tuesday",
      allDay: false,
    };
    expect(eventOccursOnDay(ev as any, new Date("2025-05-20"))).toBe(true);
    expect(eventOccursOnDay(ev as any, new Date("2025-05-27"))).toBe(true);
    expect(eventOccursOnDay(ev as any, new Date("2025-05-28"))).toBe(false);
  });

  it("shows a weekly event on the correct weekday regardless of repeat text mismatch", () => {
    const ev = {
      ...baseEvent,
      date: "2025-07-10",
      repeat: "Weekly on Friday",
      allDay: false,
    };

    expect(eventOccursOnDay(ev as any, new Date("2025-07-10"))).toBe(true);
    expect(eventOccursOnDay(ev as any, new Date("2025-07-17"))).toBe(true);
    expect(eventOccursOnDay(ev as any, new Date("2025-07-11"))).toBe(false);
  });

  it("shows a monthly event on the same day of the month", () => {
    const ev = {
      ...baseEvent,
      date: "2025-05-20",
      repeat: "Monthly",
      allDay: false,
    };
    expect(eventOccursOnDay(ev as any, new Date("2025-06-20"))).toBe(true);
    expect(eventOccursOnDay(ev as any, new Date("2025-06-19"))).toBe(false);
  });

  it("shows an annually repeating event on the same date", () => {
    const ev = {
      ...baseEvent,
      date: "2025-05-20",
      repeat: "Annually on May 20",
      allDay: false,
    };
    expect(eventOccursOnDay(ev as any, new Date("2026-05-20"))).toBe(true);
    expect(eventOccursOnDay(ev as any, new Date("2026-05-21"))).toBe(false);
  });

  it("shows a one-time event only on its specific date", () => {
    const ev = {
      ...baseEvent,
      date: "2025-07-15",
      repeat: "",
      allDay: false,
    };
    expect(eventOccursOnDay(ev as any, new Date("2025-07-15"))).toBe(true);
    expect(eventOccursOnDay(ev as any, new Date("2025-07-14"))).toBe(false);
    expect(eventOccursOnDay(ev as any, new Date("2025-07-16"))).toBe(false);
  });

  it("behaves the same for all-day and timed events", () => {
    const evDay = {
      ...baseEvent,
      date: "2025-08-10",
      repeat: "Daily",
      allDay: true,
    };
    const evTime = {
      ...baseEvent,
      date: "2025-08-10",
      repeat: "Daily",
      allDay: false,
    };
    expect(eventOccursOnDay(evDay as any, new Date("2025-08-12"))).toBe(true);
    expect(eventOccursOnDay(evTime as any, new Date("2025-08-12"))).toBe(true);
  });

  it("does not show a monthly event on an invalid day (e.g., 31st in February)", () => {
    const ev = {
      ...baseEvent,
      date: "2025-01-31",
      repeat: "Monthly",
      allDay: false,
    };
    expect(eventOccursOnDay(ev as any, new Date("2025-02-28"))).toBe(false);
    expect(eventOccursOnDay(ev as any, new Date("2025-03-31"))).toBe(true);
  });

  it("returns false if the date format is invalid", () => {
    const ev = {
      ...baseEvent,
      date: "invalid-date",
      repeat: "Daily",
      allDay: false,
    };
    expect(eventOccursOnDay(ev as any, new Date())).toBe(false);
  });
});
