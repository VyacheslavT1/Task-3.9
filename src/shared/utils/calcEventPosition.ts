const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR;

export function calcEventPosition(
  startMin: number,
  endMin: number,
  cellHeight: number
): { top: number; height: number } {
  const totalMinutes = MINUTES_IN_DAY;
  const totalHeight = cellHeight * HOURS_IN_DAY;
  const top = (startMin / totalMinutes) * totalHeight;
  const height = ((endMin - startMin) / totalMinutes) * totalHeight;
  return { top, height };
}
