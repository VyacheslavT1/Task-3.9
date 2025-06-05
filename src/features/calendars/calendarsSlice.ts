import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Calendar {
  id: string;
  title: string;
  color: string;
  visible: boolean;
}

export interface CalendarsState {
  calendars: Calendar[];
}

const initialState: CalendarsState = {
  calendars: [],
};

const calendarsSlice = createSlice({
  name: "calendars",
  initialState,
  reducers: {
    setCalendars: (state, action: PayloadAction<Calendar[]>) => {
      state.calendars = action.payload;
    },

    clearVisibleCalendarIds(state) {
      state.calendars.forEach((cal) => {
        cal.visible = false;
      });
    },
  },
});

export const { setCalendars, clearVisibleCalendarIds } = calendarsSlice.actions;
export default calendarsSlice.reducer;
