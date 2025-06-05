import { useMemo } from "react";

export default function useTimeOptions(): string[] {
  return useMemo(() => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        options.push(
          time
            .toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              hourCycle: "h12",
            })
            .toLowerCase()
        );
      }
    }
    return options;
  }, []);
}
