export interface HourItem {
  date: Date;
  hour: string;
}

export function getHours(date: Date): HourItem[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const startOfHourCycle = new Date(year, month, day, 0, 0);

  return Array.from({ length: 24 }, (_, i) => {
    const hourItem = new Date(startOfHourCycle);

    hourItem.setHours(startOfHourCycle.getHours() + i);
    const formattedTime = hourItem
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
        hourCycle: "h12",
      })
      .toLowerCase();
    return {
      date: hourItem,
      hour: formattedTime,
    };
  });
}
