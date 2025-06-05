import React from "react";
import { Button } from "shared/ui/components";
import { useLazySVG } from "shared/hooks/useLazySVG";
import { useAppDispatch, useAppSelector } from "app/appHooks";
import { shiftWeekByDays, setCurrentWeekDays } from "features/week/weekSlice";
import { setCurrentDate, shiftDateByDays } from "features/day/daySlice";
import { getWeekDays } from "shared/utils/getWeekDays";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "shared/providers/ThemeContext";
import DateNav from "./DateNav";
import ViewSwitcher from "./ViewSwitcher";
import UserMenu from "./UserMenu";
import styles from "./Header.module.css";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const currentDateTimestamp = useAppSelector((root) => root.day.currentDate);
  const weekDays = useAppSelector((root) => root.weekView.currentWeekDays);
  const viewType = location.pathname === "/dayView" ? "dayView" : "weekView";

  const headerDate =
    viewType === "dayView"
      ? new Date(currentDateTimestamp)
      : new Date(weekDays[Math.floor(weekDays.length / 2)].date);
  const headerLabel = headerDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleTodayClick = () => {
    if (viewType === "dayView") {
      dispatch(setCurrentDate(Date.now()));
    } else {
      dispatch(setCurrentWeekDays(getWeekDays(new Date())));
    }
  };
  const handlePreviousClick = () => {
    if (viewType === "dayView") {
      dispatch(shiftDateByDays(-1));
    } else {
      dispatch(shiftWeekByDays(-7));
    }
  };
  const handleNextClick = () => {
    if (viewType === "dayView") {
      dispatch(shiftDateByDays(1));
    } else {
      dispatch(shiftWeekByDays(7));
    }
  };

  const handleViewChange = (viewPath: string) => {
    navigate(viewPath);
    if (viewPath === "/dayView") {
      dispatch(setCurrentDate(Date.now()));
    } else {
      dispatch(setCurrentWeekDays(getWeekDays(new Date())));
    }
  };

  const LogoIcon = useLazySVG("shared/icons/logo.svg?react");
  const SunIcon = useLazySVG("shared/icons/sun.svg?react");
  const MoonIcon = useLazySVG("shared/icons/moon.svg?react");

  return (
    <div className={styles.header}>
      <div className={styles.leftSide}>
        {LogoIcon && (
          <div className={styles.logoIcon}>
            <LogoIcon />
          </div>
        )}
        <DateNav
          onToday={handleTodayClick}
          onPrevious={handlePreviousClick}
          onNext={handleNextClick}
          headerLabel={headerLabel}
        />
      </div>

      <div className={styles.rightSide}>
        <Button variant="toggle" onClick={toggleTheme}>
          {theme === "light"
            ? MoonIcon && <MoonIcon />
            : SunIcon && <SunIcon />}
        </Button>

        <ViewSwitcher value={location.pathname} onChange={handleViewChange} />

        <UserMenu />
      </div>
    </div>
  );
};

export default Header;
