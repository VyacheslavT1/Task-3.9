import { render } from "@testing-library/react";
import { act } from "@testing-library/react";
import TimeLine from "./TimeLine";

function getLineElement() {
  return document.querySelector(
    '[class*="line"][class*="current"]'
  ) as HTMLElement;
}

describe("TimeLine", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 5, 4, 9, 15, 0, 0));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render line with correct initial width (25%)", () => {
    render(<TimeLine cellHeight={60} />);
    const line = getLineElement();

    expect(line.style.width).toBe("25%");
  });

  it("should increase the width after advancing the timer", () => {
    render(<TimeLine cellHeight={60} />);
    let line = getLineElement();

    const initialWidth = parseFloat(line.style.width);
    expect(initialWidth).toBeCloseTo(25, 1);

    act(() => {
      jest.setSystemTime(new Date(2025, 5, 4, 9, 16, 0, 0));
      jest.advanceTimersByTime(60_000);
    });

    line = getLineElement();
    const updatedWidth = parseFloat(line.style.width);

    expect(updatedWidth).toBeGreaterThan(initialWidth);
    expect(updatedWidth).toBeLessThan(100);
  });
});
