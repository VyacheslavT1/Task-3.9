import { useState, useEffect } from "react";
import {
  getFirestore,
  addDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

interface Calendar {
  id: string;
  title: string;
  color: string;
  visible: boolean;
}

const AVAILABLE_COLORS = [
  "#9f2957",
  "#d90056",
  "#e25d33",
  "#dfc45a",
  "#b8c42f",
  "#15af6e",
  "#429488",
  "#397e4a",
  "#439bdf",
  "#4154ae",
  "#6c7ac4",
  "#8333a4",
];

export function useCalendars(uid?: string) {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setIsLoading(false);
      setCalendars([]);
      return;
    }

    const db = getFirestore();
    const calendarQuery = query(
      collection(db, "calendars"),
      where("uid", "==", uid)
    );

    (async () => {
      try {
        const snapshot = await getDocs(calendarQuery);
        if (snapshot.empty) {
          await addDoc(collection(db, "calendars"), {
            title: "Calendar 1",
            color: AVAILABLE_COLORS[0],
            visible: true,
            uid,
          });
        }
      } catch (e) {
        console.error("Error creating default calendar:", e);
      }
    })();

    const unsubscribe = onSnapshot(
      calendarQuery,
      (snapshot) => {
        const calendarsList: Calendar[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Calendar, "id">),
        }));
        setCalendars(calendarsList);
        setIsLoading(false);
      },
      (err) => {
        setError(err), setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [uid]);
  return { data: calendars, isLoading, error };
}
