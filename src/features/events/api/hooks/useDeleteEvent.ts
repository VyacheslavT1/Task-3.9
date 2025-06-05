import { getFirestore, deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";

export function useDeleteEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function deleteEvent(calendarId: string, eventId: string) {
    setIsLoading(true);
    setError(null);
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "calendars", calendarId, "events", eventId));
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return { deleteEvent, isLoading, error };
}
