import { useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setCalendars, Calendar } from "features/calendars/calendarsSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "shared/api/firebase";

export function useCalendarsListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const db = getFirestore();
    let unsubscribeFromSnapshot: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const colRef = collection(db, "calendars");
        unsubscribeFromSnapshot = onSnapshot(colRef, (snap) => {
          const list: Calendar[] = snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Calendar, "id">),
          }));
          dispatch(setCalendars(list));
        });
      } else {
        if (unsubscribeFromSnapshot) {
          unsubscribeFromSnapshot();
          unsubscribeFromSnapshot = null;
        }
        dispatch(setCalendars([]));
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFromSnapshot) {
        unsubscribeFromSnapshot();
      }
    };
  }, [dispatch]);
}
