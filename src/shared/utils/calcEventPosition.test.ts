import { calcEventPosition } from "./calcEventPosition";

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR;
const CELL_HEIGHT = 80;
const FULL_GRID_HEIGHT = HOURS_IN_DAY * CELL_HEIGHT;

describe("calcEventPosition", () => {
  it("should place a 1-hour event at the top when start is 0 minutes", () => {
    const eventStart = 0;
    const eventEnd = MINUTES_IN_HOUR;
    const { top, height } = calcEventPosition(
      eventStart,
      eventEnd,
      CELL_HEIGHT
    );
    expect(top).toBeCloseTo(0);
    expect(height).toBeCloseTo(CELL_HEIGHT);
  });

  it("should place a 1-hour event starting at 1:00 AM correctly", () => {
    const eventStart = MINUTES_IN_HOUR;
    const eventEnd = 2 * MINUTES_IN_HOUR;
    const { top, height } = calcEventPosition(
      eventStart,
      eventEnd,
      CELL_HEIGHT
    );
    expect(top).toBeCloseTo(CELL_HEIGHT);
    expect(height).toBeCloseTo(CELL_HEIGHT);
  });

  it("should calculate fractional positioning for a 1-hour event starting at 1:30 AM", () => {
    const eventStart = MINUTES_IN_HOUR + 30;
    const eventEnd = eventStart + MINUTES_IN_HOUR;
    const { top, height } = calcEventPosition(
      eventStart,
      eventEnd,
      CELL_HEIGHT
    );
    const expectedTop = (eventStart / MINUTES_IN_DAY) * FULL_GRID_HEIGHT;
    expect(top).toBeCloseTo(expectedTop);
    expect(height).toBeCloseTo(CELL_HEIGHT);
  });

  it("should span the full grid for a 24-hour event", () => {
    const eventStart = 0;
    const eventEnd = MINUTES_IN_DAY;
    const { top, height } = calcEventPosition(
      eventStart,
      eventEnd,
      CELL_HEIGHT
    );
    expect(top).toBeCloseTo(0);
    expect(height).toBeCloseTo(FULL_GRID_HEIGHT);
  });

  it("should return zero height for zero-length event", () => {
    const eventStart = 5 * MINUTES_IN_HOUR;
    const eventEnd = eventStart;
    const { top, height } = calcEventPosition(
      eventStart,
      eventEnd,
      CELL_HEIGHT
    );
    const expectedTop = (eventStart / MINUTES_IN_DAY) * FULL_GRID_HEIGHT;
    expect(top).toBeCloseTo(expectedTop);
    expect(height).toBeCloseTo(0);
  });
});
