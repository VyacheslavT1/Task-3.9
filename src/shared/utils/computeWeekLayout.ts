import { Event } from "features/events/api/hooks/useEvents";
import { parseTimeToMinutes } from "./parseTimeToMinutes";
import { calcEventPosition } from "./calcEventPosition";

interface PositionedEvent extends Event {
  top: number;
  height: number;
  column: number;
  columns: number;
}

export function computeWeekLayout(
  events: Event[],
  cellHeight: number
): PositionedEvent[] {
  const sortedEvents = [...events].sort(
    (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)
  );

  const columnEndMinutes: number[] = [];
  const positionedEvents: PositionedEvent[] = [];

  for (const event of sortedEvents) {
    const startMinutes = parseTimeToMinutes(event.startTime);
    const endMinutes = parseTimeToMinutes(event.endTime);

    let columnIndex = columnEndMinutes.findIndex((end) => startMinutes >= end);
    if (columnIndex === -1) columnIndex = columnEndMinutes.length;
    columnEndMinutes[columnIndex] = endMinutes;

    const { top, height: rawHeight } = calcEventPosition(
      startMinutes,
      endMinutes,
      cellHeight
    );

    const hasEndTime = Boolean(event.endTime);
    const minHeight = hasEndTime ? cellHeight / 2 : cellHeight / 4;
    const height = Math.max(rawHeight, minHeight);

    positionedEvents.push({
      ...event,
      top,
      height,
      column: columnIndex,
      columns: 0, // will be set later
    });
  }

  const positionedByTop = [...positionedEvents].sort((a, b) => a.top - b.top);
  positionedByTop.forEach((currentEvent, i) => {
    for (let j = i + 1; j < positionedByTop.length; j++) {
      const nextEvent = positionedByTop[j];
      if (nextEvent.top > currentEvent.top) {
        const bottom = currentEvent.top + currentEvent.height;
        if (bottom > nextEvent.top) {
          currentEvent.height = nextEvent.top - currentEvent.top;
        }
        break;
      }
    }
  });

  const totalColumns = columnEndMinutes.length;
  positionedEvents.forEach((event) => (event.columns = totalColumns));

  return positionedEvents;
}
