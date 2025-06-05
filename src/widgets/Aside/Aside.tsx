import React from "react";
import { Button, DatePicker } from "shared/ui/components";
import CreateEventForm from "features/events/ui/CreateEventForm/CreateEventForm";
import CalendarList from "./CalendarsList";
import { useNavigate, useLocation } from "react-router-dom";
import { useLazySVG } from "shared/hooks/useLazySVG";
import { useModal } from "shared/ui/context/ModalContext";
import { useAppSelector, useAppDispatch } from "app/appHooks";
import { useCalendars } from "features/calendars/api/hooks/useCalendars";
import { setCurrentDate } from "features/day/daySlice";
import { setCurrentWeekDays } from "features/week/weekSlice";
import { getWeekDays } from "shared/utils/getWeekDays";
import styles from "./Aside.module.css";

interface AsideProps {
  children?: React.ReactNode;
}

const Aside: React.FC<AsideProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const PlusIcon = useLazySVG("shared/icons/plus.svg?react");
  const { openModal, closeModal } = useModal();

  const viewType = location.pathname === "/dayView" ? "dayView" : "weekView";

  const authUser = useAppSelector((state) => state.auth.user);
  const uid = authUser?.uid;
  const { data: calendars = [], isLoading, error } = useCalendars(uid);

  if (isLoading) {
    return <div>Loading calendars…</div>;
  }
  if (error) {
    return <div>Error loading calendars</div>;
  }

  const handleDateSelect = (date: Date) => {
    if (viewType === "dayView") {
      dispatch(setCurrentDate(date.getTime()));
      navigate("/dayView");
    } else {
      dispatch(setCurrentWeekDays(getWeekDays(date)));
      navigate("/weekView");
    }
  };

  return (
    <div className={styles.aside}>
      <Button
        variant="primary"
        onClick={() =>
          openModal(<CreateEventForm onClose={closeModal} />, "Create event")
        }
      >
        {PlusIcon && <PlusIcon />} Create
      </Button>

      <DatePicker onDateSelect={handleDateSelect} />

      <CalendarList calendars={calendars} onCloseModal={closeModal} />
    </div>
  );
};

export default Aside;
