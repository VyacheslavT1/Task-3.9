import { useState } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

export function useUpdateCalendar() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  async function updateCalendar(
    id: string,
    data: { title?: string; color?: string }
  ) {
    setIsLoading(true);
    setError(null);
    try {
      const db = getFirestore();
      const ref = doc(db, "calendars", id);
      await updateDoc(ref, data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }
  return { updateCalendar, isLoading, error };
}
