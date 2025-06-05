import { useState } from "react";
import {
  getFirestore,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { auth } from "shared/api/firebase";

export function useCreateEvent() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  async function createEvent(payload: {
    title: string;
    date: Date | null;
    calendarId: string;
    repeat: string;
    allDay: boolean;
    description: string;
  }) {
    setIsLoading(true);
    setError(null);
    try {
      const db = getFirestore();
      const user = auth.currentUser;
      if (!user) {
        setError(new Error("User is not authenticated"));
        setIsLoading(false);
        return;
      }
      await addDoc(collection(db, "calendars", payload.calendarId, "events"), {
        ...payload,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error creating calendar:", e);
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }
  return { createEvent, isLoading, error };
}
