export interface RepeatOption {
  value: string;
  label: string;
}

export function getRepeatOptions(selectedDate: Date | null): RepeatOption[] {
  const formattedWeekDay: string = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { weekday: "long" })
    : "";
  const formattedMonthAndDay: string = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })
    : "";

  return [
    { value: "Does not repeat", label: "Does not repeat" },
    { value: "Daily", label: "Daily" },
    {
      value: `Weekly on ${formattedWeekDay}`,
      label: `Weekly on ${formattedWeekDay}`,
    },
    { value: "Monthly", label: "Monthly" },
    {
      value: `Annually on ${formattedMonthAndDay}`,
      label: `Annually on ${formattedMonthAndDay}`,
    },
  ];
}
