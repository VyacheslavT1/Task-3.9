import React, { useMemo } from "react";
import Aside from "widgets/Aside/Aside";
import EventItem from "features/events/ui/EventItem/EventItem";
import CreateEventForm from "features/events/ui/CreateEventForm/CreateEventForm";
import { TimeLine } from "shared/ui/components";
import { useModal } from "shared/ui/context/ModalContext";
import { getHours, HourItem } from "shared/utils/getHours";
import { useAppSelector } from "app/appHooks";
import { useEvents } from "features/events/api/hooks/useEvents";
import {
  selectVisibleCalendarIds,
  selectCalendarColor,
} from "features/calendars/selectors";
import { computeDayLayout } from "shared/utils/computeDayLayout";
import { eventOccursOnDay } from "shared/utils/eventOccursOnDay";
import styles from "./DayView.module.scss";

interface DayViewProps {}
const CELL_HEIGHT = 80;

const DayView: React.FC<DayViewProps> = () => {
  const currentDateTimestamp = useAppSelector((state) => state.day.currentDate);
  const today = useMemo(
    () => new Date(currentDateTimestamp),
    [currentDateTimestamp]
  );

  const startOfDay = useMemo(() => {
    const date = new Date(currentDateTimestamp);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [currentDateTimestamp]);

  const endOfDay = useMemo(() => {
    const date = new Date(currentDateTimestamp);
    date.setHours(23, 59, 59, 999);
    return date;
  }, [currentDateTimestamp]);

  // --- check if it's today ---
  const isToday = useMemo(() => {
    const now = new Date();
    return (
      now.getFullYear() === today.getFullYear() &&
      now.getMonth() === today.getMonth() &&
      now.getDate() === today.getDate()
    );
  }, [today]);

  // --- day info for header ---
  const dayInfo = useMemo(
    () => ({
      dayOfMonth: today.getDate(),
      dayName: today.toLocaleDateString("en-US", { weekday: "short" }),
    }),
    [today]
  );

  // --- calendars + events ---
  const visibleCalendarIds = useAppSelector(selectVisibleCalendarIds);
  const calendarColors = useAppSelector(selectCalendarColor);
  const { events } = useEvents(startOfDay, endOfDay, visibleCalendarIds);

  // --- modal for event creation ---
  const { openModal, closeModal } = useModal();
  const formatWithMinutes = (raw: string) => {
    const [hourPart, period] = raw.split(" ");
    const paddedHour = hourPart.padStart(2, "");
    return `${paddedHour}:00 ${period}`;
  };
  const handleCreateEvent = (hourLabel: string) => {
    const [hourStr, period] = hourLabel.split(" ");
    let hour24 = Number(hourStr);
    if (period.toLowerCase() === "pm" && hour24 < 12) hour24 += 12;
    if (period.toLowerCase() === "am" && hour24 === 12) hour24 = 0;
    const cellDate = new Date(today);
    cellDate.setHours(hour24, 0, 0, 0);

    openModal(
      <CreateEventForm
        onClose={closeModal}
        initialValues={{
          date: cellDate,
          startTime: formatWithMinutes(hourLabel),
          allDay: false,
        }}
      />,
      "Create event"
    );
  };

  // --- hours for grid ---
  const hours = useMemo(() => getHours(today), [today]);

  // --- positioning timed events ---
  const dayEvents = events.filter(
    (event) => !event.allDay && eventOccursOnDay(event, today)
  );
  const positioned = computeDayLayout(dayEvents, CELL_HEIGHT);
  const uniquePositioned = Array.from(
    new Map(positioned.map((event) => [event.id, event])).values()
  );

  // --- all-day events ---
  const allDayEvents = events.filter(
    (event) => event.allDay && eventOccursOnDay(event, today)
  );

  return (
    <div className={styles.dayContainer}>
      <Aside />
      <div className={styles.wrapper}>
        {/* HEADER + ALL-DAY */}
        <div className={styles.headerContainer}>
          <div className={styles.headerRow}>
            <div className={styles.empty} />
            <div
              className={`${styles.dayLabel} ${isToday ? styles.today : ""}`}
            >
              <span className={styles.date}>{dayInfo.dayOfMonth}</span>
              <span className={styles.weekDay}>{dayInfo.dayName}</span>
            </div>
          </div>
          <div className={styles.allDayEvents}>
            <div className={styles.empty} />
            <div className={styles.allDayCell}>
              {allDayEvents.map((ev) => (
                <EventItem
                  key={ev.id}
                  event={{ ...ev, date: today.toISOString() }}
                  cellHeight={CELL_HEIGHT}
                  color={calendarColors[ev.calendarId]}
                  style={{
                    position: "static",
                    marginBottom: "0.25rem",
                    width: "100%",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* HOURS GRID + TIMED EVENTS LAYER */}
        <div className={styles.gridWrapper}>
          {hours.map((hourItem: HourItem, index) => (
            <div key={index} className={styles.hourRow}>
              <div className={styles.timeCell}>
                <span className={styles.timeLabel}>{hourItem.hour}</span>
              </div>
              <div
                className={styles.dayCell}
                onClick={() => handleCreateEvent(hourItem.hour)}
              />
            </div>
          ))}

          <div className={styles.eventsLayer}>
            {isToday && <TimeLine cellHeight={CELL_HEIGHT} />}
            {uniquePositioned.map((event) => {
              // calculate width and left offset
              const percent = 100 / event.columns;
              const width = `${percent}%`;
              const left = `${percent * event.column}%`;
              return (
                <EventItem
                  key={event.id}
                  event={{ ...event, date: today.toISOString() }}
                  cellHeight={CELL_HEIGHT}
                  color={calendarColors[event.calendarId]}
                  style={{
                    top: `${event.top}px`,
                    height: `${event.height}px`,
                    left,
                    width,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
