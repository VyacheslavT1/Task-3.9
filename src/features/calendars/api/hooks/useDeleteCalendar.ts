import { useState } from "react";
import {
  getFirestore,
  collection,
  writeBatch,
  where,
  query,
  doc,
  getDocs,
} from "firebase/firestore";
import { auth } from "shared/api/firebase";

export function useDeleteCalendar() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  async function deleteCalendar(id: string) {
    setIsLoading(true);
    setError(null);
    try {
      const db = getFirestore();
      const user = auth.currentUser;
      if (!user) throw new Error("User is not authenticated");
      const uid = user.uid;
      const batch = writeBatch(db);
      const calRef = doc(db, "calendars", id);
      const allCalls = await getDocs(
        query(collection(db, "calendars"), where("uid", "==", uid))
      );
      if (allCalls.size <= 1) {
        throw new Error("You can not delete default calendar");
      }
      batch.delete(calRef);
      const eventsCollection = collection(db, "calendars", id, "events");
      const snapshot = await getDocs(eventsCollection);
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return { deleteCalendar, isLoading, error };
}
