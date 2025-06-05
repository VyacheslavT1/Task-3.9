import { useState } from "react";
import { getFirestore, updateDoc, doc } from "firebase/firestore";

export function useToggleCalendarVisibility() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  async function toggleVisibility(id: string, current: boolean) {
    setIsLoading(true);
    setError(null);
    try {
      const db = getFirestore();
      const ref = doc(db, "calendars", id);
      await updateDoc(ref, { visible: !current });
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }
  return { toggleVisibility, isLoading, error };
}
