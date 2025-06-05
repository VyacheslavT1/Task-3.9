import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DayState {
  currentDate: number;
}

const initialState: DayState = {
  currentDate: Date.now(),
};

const daySlice = createSlice({
  name: "dayView",
  initialState,
  reducers: {
    setCurrentDate(state, action: PayloadAction<number>) {
      state.currentDate = action.payload;
    },
    shiftDateByDays(state, action: PayloadAction<number>) {
      const newDate = new Date(state.currentDate);
      newDate.setDate(newDate.getDate() + action.payload);
      state.currentDate = newDate.getTime();
    },
  },
});

export const { setCurrentDate, shiftDateByDays } = daySlice.actions;
export default daySlice.reducer;
