import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "shared/api/firebase";
import { useAppDispatch, useAppSelector } from "app/appHooks";
import { setUser, clearUser } from "features/auth/model/authSlice";
import { useCalendars } from "features/calendars/api/hooks/useCalendars";
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
  useCalendars(authUser?.uid);
  return <>{children}</>;
};

export default AuthProvider;
