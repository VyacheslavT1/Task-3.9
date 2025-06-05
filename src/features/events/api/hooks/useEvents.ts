import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

export interface Event {
  id: string;
  title: string;
  date: string;
  calendarId: string;
  startTime: string;
  endTime: string;
  repeat: string;
  allDay: boolean;
  description: string;
  uid: string;
  timestamp: number;
}

export function useEvents(
  weekStart: Date,
  weekEnd: Date,
  calendarIds: string[]
) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setEvents([]);
    if (calendarIds.length === 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    const db = getFirestore();
    let subscriptionsReady = 0;

    const unsubscribes = calendarIds.map((calId) => {
      const colRef = collection(db, "calendars", calId, "events");
      const q = query(
        colRef,
        where("date", ">=", weekStart),
        where("date", "<=", weekEnd)
      );

      return onSnapshot(
        q,
        (snap: QuerySnapshot<DocumentData>) => {
          const events = snap.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title,
              date: data.date,
              calendarId: data.calendarId,
              startTime: data.startTime,
              endTime: data.endTime,
              repeat: data.repeat,
              allDay: data.allDay,
              description: data.description,
              uid: data.uid,
              timestamp: data.timestamp,
            } as Event;
          });

          setEvents((prev) => [
            ...prev.filter((e) => e.calendarId !== calId),
            ...events,
          ]);

          subscriptionsReady += 1;
          if (subscriptionsReady === calendarIds.length) {
            setIsLoading(false);
          }
        },
        (err) => {
          if ((err as any).code === "permission-denied") {
            unsubscribes.forEach((fn) => fn());
            setEvents([]);
            setIsLoading(false);
            return;
          }
          setError(err);
          setIsLoading(false);
        }
      );
    });

    return () => unsubscribes.forEach((fn) => fn());
  }, [weekStart, weekEnd, calendarIds]);

  return { events, isLoading, error };
}
