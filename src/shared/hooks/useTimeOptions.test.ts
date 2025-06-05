import useTimeOptions from "./useTimeOptions";
import { renderHook } from "@testing-library/react";

describe("useTimeOptions hook", () => {
  it("returns an array of 96 time options", () => {
    const { result } = renderHook(() => useTimeOptions());
    expect(result.current).toHaveLength(96);
  });

  it("should render time in correct format h:mm am/pm", () => {
    const { result } = renderHook(() => useTimeOptions());
    const timeFormat = /^(1[0-2]|[1-9]):(00|15|30|45)\s?(am|pm)$/;
    result.current.forEach((option) => {
      expect(option).toMatch(timeFormat);
    });
  });
  it("should display time options with 15-minute intervals", () => {
    const { result } = renderHook(() => useTimeOptions());
    expect(result.current[0]).toBe("12:00 am");
    expect(result.current[1]).toBe("12:15 am");
    expect(result.current[2]).toBe("12:30 am");
    expect(result.current[3]).toBe("12:45 am");
    expect(result.current[95]).toBe("11:45 pm");
  });

  it("should show that all time options are unique", () => {
    const { result } = renderHook(() => useTimeOptions());
    const uniqueTimeOption = new Set(result.current);
    expect(uniqueTimeOption.size).toBe(96);
  });
});
