export interface WeekDayItem {
  date: string;
  dayOfMonth?: number;
  dayName?: string;
  isToday?: boolean;
}

export function getWeekDays(
  date: Date,
  weekStartDay: number = 0
): WeekDayItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeekDate = new Date(date.getTime());
  startOfWeekDate.setHours(0, 0, 0, 0);

  const currentWeekdayIndex = startOfWeekDate.getDay();
  const diff = (currentWeekdayIndex - weekStartDay + 7) % 7;
  startOfWeekDate.setDate(startOfWeekDate.getDate() - diff);

  const weekDates: WeekDayItem[] = [];
  for (let i = 0; i < 7; i++) {
    const weekDayDate = new Date(startOfWeekDate);
    weekDayDate.setDate(startOfWeekDate.getDate() + i);
    const dayOfMonth = weekDayDate.getDate();
    const dayName = weekDayDate
      .toLocaleString("en-US", {
        weekday: "short",
      })
      .toUpperCase();
    const isToday = weekDayDate.getTime() === today.getTime();
    weekDates.push({
      date: weekDayDate.toISOString(),
      dayOfMonth,
      dayName,
      isToday,
    });
  }
  return weekDates;
}
