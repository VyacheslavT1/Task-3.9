import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "features/auth/model/authSlice";
import weekReducer from "features/week/weekSlice";
import dayReducer from "features/day/daySlice";
import calendarsReducer from "features/calendars/calendarsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    weekView: weekReducer,
    day: dayReducer,
    calendars: calendarsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type { AuthState };
export default store;
