import { useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { EventFormPayload } from "features/events/ui/EventForm/EventForm";

export function useUpdateEvent() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  async function updateEvent(
    eventId: string,
    originalCalendarId: string,
    updatedData: EventFormPayload
  ) {
    setIsLoading(true);
    setError(null);
    try {
      const db = getFirestore();
      const sourceRef = doc(
        db,
        "calendars",
        originalCalendarId,
        "events",
        eventId
      );

      const snapshot = await getDoc(sourceRef);
      if (!snapshot.exists()) {
        throw new Error(
          `Event with ID ${eventId} not found in calendar ${originalCalendarId}`
        );
      }
      const sourceData = snapshot.data();

      const targetRef = doc(
        db,
        "calendars",
        updatedData.calendarId,
        "events",
        eventId
      );

      const eventData: any = {
        ...sourceData,
        title: updatedData.title,
        date: updatedData.date
          ? Timestamp.fromDate(updatedData.date)
          : sourceData.date,
        repeat: updatedData.repeat,
        allDay: updatedData.allDay,
        description: updatedData.description,
        calendarId: updatedData.calendarId,
      };

      if (updatedData.startTime !== undefined) {
        eventData.startTime = updatedData.startTime;
      }
      if (updatedData.endTime !== undefined) {
        eventData.endTime = updatedData.endTime;
      }

      await setDoc(targetRef, eventData);

      if (originalCalendarId !== updatedData.calendarId) {
        await deleteDoc(sourceRef);
      }
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  return { updateEvent, isLoading, error };
}
