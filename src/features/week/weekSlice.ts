import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getWeekDays, WeekDayItem } from "shared/utils/getWeekDays";

export interface WeekState {
  currentWeekDays: WeekDayItem[];
}

function calculateWeekStartDate(referenceDate: Date, offsetDays: number): Date {
  const startOfWeek = new Date(referenceDate.getTime());
  startOfWeek.setDate(startOfWeek.getDate() + offsetDays);
  return startOfWeek;
}

const weekSlice = createSlice({
  name: "weekView",
  initialState: {
    currentWeekDays: getWeekDays(new Date()),
  } as WeekState,
  reducers: {
    shiftWeekByDays(state, action: PayloadAction<number>) {
      const currentWeekStartDay = new Date(state.currentWeekDays[0].date);
      const newWeekStartDay = calculateWeekStartDate(
        currentWeekStartDay,
        action.payload
      );
      state.currentWeekDays = getWeekDays(newWeekStartDay);
    },

    setCurrentWeekDays(state, action: PayloadAction<WeekDayItem[]>) {
      state.currentWeekDays = action.payload;
    },
  },
});
export const { shiftWeekByDays, setCurrentWeekDays } = weekSlice.actions;

export default weekSlice.reducer;
