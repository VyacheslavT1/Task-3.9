import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export function useAppDispatch(): AppDispatch {
  return useDispatch();
}
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
