import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "shared/api/firebase";

export function useCreateCalendar() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  async function createCalendar({
    title,
    color,
  }: {
    title: string;
    color: string;
  }) {
    setIsLoading(true);
    try {
      const db = getFirestore();
      const user = auth.currentUser;
      if (!user) {
        setError(new Error("User is not authenticated"));
        setIsLoading(false);
        return;
      }
      await addDoc(collection(db, "calendars"), {
        title,
        color,
        visible: true,
        uid: user.uid,
      });
    } catch (e) {
      console.error("Error creating calendar:", e);
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }
  return { createCalendar, isLoading, error };
}
