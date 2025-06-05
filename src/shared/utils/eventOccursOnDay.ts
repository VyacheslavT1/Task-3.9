import type { Event } from "features/events/api/hooks/useEvents";
import { toDateKey } from "./toDateKey";

function asDate(input: unknown): Date {
  const rawDateInput: any = input;

  if (typeof rawDateInput === "string") {
    return new Date(rawDateInput);
  }
  if (rawDateInput instanceof Date) {
    return rawDateInput;
  }

  if (typeof rawDateInput?.toDate === "function") {
    return rawDateInput.toDate();
  }

  return new Date(rawDateInput);
}

export function eventOccursOnDay(eventItem: Event, date: Date): boolean {
  const evDate = asDate(eventItem.date);
  const evKey = toDateKey(evDate);
  const dayKey = toDateKey(date);

  if (evKey === dayKey) {
    return true;
  }

  if (eventItem.repeat === "Daily" && evDate <= date) {
    return true;
  }
  if (
    eventItem.repeat.startsWith("Weekly on") &&
    evDate <= date &&
    evDate.getDay() === date.getDay()
  ) {
    return true;
  }
  if (
    eventItem.repeat === "Monthly" &&
    evDate <= date &&
    evDate.getDate() === date.getDate()
  ) {
    return true;
  }
  if (
    eventItem.repeat.startsWith("Annually on") &&
    evDate <= date &&
    evDate.getDate() === date.getDate() &&
    evDate.getMonth() === date.getMonth()
  ) {
    return true;
  }

  return false;
}
