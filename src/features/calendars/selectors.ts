import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const selectVisibleCalendarIds = createSelector(
  (state: RootState) => state.calendars.calendars,
  (calendars) =>
    calendars
      .filter((calendar) => calendar.visible)
      .map((calendar) => calendar.id)
);

export const selectCalendarColor = createSelector(
  (state: RootState) => state.calendars.calendars,
  (calendars) =>
    calendars.reduce<Record<string, string>>((acc, cal) => {
      acc[cal.id] = cal.color;
      return acc;
    }, {})
);
