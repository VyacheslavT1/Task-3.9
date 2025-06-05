interface DayItem {
  date: Date;
  disabled: boolean;
}

export default function getDaysInMonth(date: Date): DayItem[] {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekDay = firstDayOfMonth.getDay();
  const startDate = new Date(year, month, 1 - startWeekDay);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startWeekDay + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, i) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    return {
      date: currentDate,
      disabled: currentDate.getMonth() !== month,
    };
  });
}
