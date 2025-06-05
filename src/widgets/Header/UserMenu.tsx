import React, { useState } from "react";
import { Button } from "shared/ui/components";
import { useLazySVG } from "shared/hooks/useLazySVG";
import { useAppSelector, useAppDispatch } from "app/appHooks";
import { signOut } from "firebase/auth";
import { auth } from "shared/api/firebase";
import { useNavigate } from "react-router-dom";
import { clearVisibleCalendarIds } from "features/calendars/calendarsSlice";
import styles from "./Header.module.css";

const UserMenu: React.FC = () => {
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const currentUser = useAppSelector((state) => state.auth.user);
  const firstName = currentUser?.displayName?.split(" ")[0] ?? "";

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const LogoutIcon = useLazySVG("shared/icons/logout.svg?react");

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearVisibleCalendarIds());
    navigate("/");
  };

  return (
    <div
      className={styles.userLogout}
      onClick={() => setIsLogoutVisible((prev) => !prev)}
    >
      <div className={styles.user}>
        <span className={styles.username}>{firstName}</span>
        <span className={styles.userAvatar}>
          {currentUser?.photoURL && !avatarError ? (
            <img
              src={currentUser.photoURL}
              className={styles.avatarImg}
              onError={() => setAvatarError(true)}
            />
          ) : (
            firstName.charAt(0).toUpperCase()
          )}
        </span>
      </div>

      {isLogoutVisible && (
        <Button variant="secondary" onClick={handleLogout}>
          {LogoutIcon && <LogoutIcon />}
          Logout
        </Button>
      )}
    </div>
  );
};

export default UserMenu;
