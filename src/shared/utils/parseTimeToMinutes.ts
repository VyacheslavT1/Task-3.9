export function parseTimeToMinutes(time?: string): number {
  if (!time) {
    return 0;
  }
  const normalized = time.trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (!match) {
    return 0;
  }
  let [, hh, mm = "0", period] = match;
  let hours = parseInt(hh, 10);
  const minutes = parseInt(mm, 10);
  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours < 12) hours += 12;
  return hours * 60 + minutes;
}
