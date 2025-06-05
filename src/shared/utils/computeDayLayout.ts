import { Event } from "features/events/api/hooks/useEvents";
import { parseTimeToMinutes } from "./parseTimeToMinutes";
import { calcEventPosition } from "./calcEventPosition";

export interface DayPositionedEvent extends Event {
  top: number;
  height: number;
  column: number;
  columns: number;
}

export function computeDayLayout(
  events: Event[],
  cellHeight: number
): DayPositionedEvent[] {
  const sortedEvents = [...events].sort(
    (eventA, eventB) =>
      parseTimeToMinutes(eventA.startTime) -
      parseTimeToMinutes(eventB.startTime)
  );

  const windows: Event[][] = [];
  let currentWindow: Event[] = [];
  let windowEndMinute = -Infinity;

  for (const event of sortedEvents) {
    const startMinute = parseTimeToMinutes(event.startTime);
    const endMinute = parseTimeToMinutes(event.endTime);

    if (!currentWindow.length || startMinute < windowEndMinute) {
      currentWindow.push(event);
      windowEndMinute = Math.max(windowEndMinute, endMinute);
    } else {
      windows.push(currentWindow);
      currentWindow = [event];
      windowEndMinute = endMinute;
    }
  }
  if (currentWindow.length) windows.push(currentWindow);

  const result: DayPositionedEvent[] = [];

  for (const windowEvents of windows) {
    const columnEndMinutes: number[] = [];
    const positionedEvents = windowEvents.map((event) => {
      const startMinute = parseTimeToMinutes(event.startTime);
      const endMinute = parseTimeToMinutes(event.endTime);

      let column = columnEndMinutes.findIndex(
        (colEndMinute) => startMinute >= colEndMinute
      );
      if (column === -1) column = columnEndMinutes.length;
      columnEndMinutes[column] = endMinute;

      const { top, height: rawHeight } = calcEventPosition(
        startMinute,
        endMinute,
        cellHeight
      );

      const hasEndTime = Boolean(event.endTime);
      const minHeight = hasEndTime ? cellHeight / 2 : cellHeight / 4;
      const height = Math.max(rawHeight, minHeight);

      return { event, top, height, endMinute, column };
    });

    const columnsCount = columnEndMinutes.length;

    const sortedByEndTimeDesc = [...positionedEvents].sort(
      (a, b) => b.endMinute - a.endMinute
    );

    sortedByEndTimeDesc.forEach((item, index) => {
      result.push({
        ...item.event,
        top: item.top,
        height: item.height,
        column: index,
        columns: columnsCount,
      });
    });
  }

  return result.sort(
    (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)
  );
}
