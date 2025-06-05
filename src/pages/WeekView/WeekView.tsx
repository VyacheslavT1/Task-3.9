import React, { useMemo, Fragment } from "react";
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
import { computeWeekLayout } from "shared/utils/computeWeekLayout";
import { eventOccursOnDay } from "shared/utils/eventOccursOnDay";
import styles from "./WeekView.module.css";

interface WeekViewProps {}

const CELL_HEIGHT = 80;

const WeekView: React.FC<WeekViewProps> = () => {
  // --- week and hours ---
  const weekDays = useAppSelector((state) => state.weekView.currentWeekDays);
  const weekStart = useMemo(() => new Date(weekDays[0].date), [weekDays]);
  const weekEnd = useMemo(() => new Date(weekDays[6].date), [weekDays]);
  const hours = getHours(weekStart);

  // --- calendars and events ---
  const visibleCalendarIds = useAppSelector(selectVisibleCalendarIds);
  const calendarColors = useAppSelector(selectCalendarColor);
  const { events } = useEvents(weekStart, weekEnd, visibleCalendarIds);

  const { openModal, closeModal } = useModal();

  // converts "2 pm" to "2:00 pm"
  const formatWithMinutes = (raw: string) => {
    const [hourPart, period] = raw.split(" ");
    const paddedHour = hourPart.padStart(2, "");
    return `${paddedHour}:00 ${period}`;
  };

  const handleCellClick = (isoDate: string, hourLabel: string) => {
    const cellDate = new Date(isoDate);
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

  return (
    <div className={styles.weekContainer}>
      <Aside />

      <div className={styles.wrapper}>
        {/* header with days and all-day events */}
        <div className={styles.headerContainer}>
          <div className={styles.weekDays}>
            <div className={styles.empty} />
            {weekDays.map((dayInfo) => (
              <div
                key={dayInfo.date}
                className={`${styles.dayLabel} ${
                  dayInfo.isToday ? styles.today : ""
                }`}
              >
                <span className={styles.date}>{dayInfo.dayOfMonth}</span>
                <span className={styles.weekDay}>{dayInfo.dayName}</span>
              </div>
            ))}
          </div>
          <div className={styles.allDayEvents}>
            <div className={styles.empty} />
            {weekDays.map((dayInfo) => {
              const dateObj = new Date(dayInfo.date);
              const allDayEvents = events.filter(
                (ev) => ev.allDay && eventOccursOnDay(ev, dateObj)
              );
              return (
                <div key={dayInfo.date} className={styles.allDayCell}>
                  {allDayEvents.map((ev) => (
                    <EventItem
                      key={`${ev.id}-${dayInfo.date}`}
                      event={{ ...ev, date: dayInfo.date }}
                      cellHeight={CELL_HEIGHT}
                      color={calendarColors[ev.calendarId]}
                      style={{
                        position: "static",
                        marginBottom: "0.25rem",
                        width: "calc(100% - 0.5rem)",
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* grid + timed events layer */}
        <div className={styles.gridWrapper}>
          {/* background cells */}
          <div className={styles.weekGrid}>
            {hours.map((hourItem: HourItem, hourIndex) => (
              <Fragment key={hourIndex}>
                <div className={styles.time}>
                  <span className={styles.timeLabel}>{hourItem.hour}</span>
                </div>
                {weekDays.map((dayInfo) => (
                  <div
                    key={`${dayInfo.date}-${hourItem.hour}`}
                    className={styles.hourCell}
                    onClick={() => handleCellClick(dayInfo.date, hourItem.hour)}
                  />
                ))}
              </Fragment>
            ))}
          </div>

          {/* timed events layer */}
          <div className={styles.eventsLayer}>
            {weekDays.map((dayInfo) => {
              const dateObj = new Date(dayInfo.date);
              //  all timed events for this day
              const dayEvents = events.filter(
                (ev) => !ev.allDay && eventOccursOnDay(ev, dateObj)
              );
              //  computeWeekLayout calculates top/height for each
              const positioned = computeWeekLayout(dayEvents, CELL_HEIGHT);
              //  remove duplicates by id
              const uniquePositioned = Array.from(
                new Map(positioned.map((evt) => [evt.id, evt])).values()
              );
              //  group by startTime
              const byStart: Record<string, typeof uniquePositioned> = {};
              uniquePositioned.forEach((evt) => {
                const key = evt.startTime;
                if (!byStart[key]) byStart[key] = [];
                byStart[key].push(evt);
              });

              return (
                <div key={dayInfo.date} className={styles.dayColumn}>
                  {dayInfo.isToday && <TimeLine cellHeight={CELL_HEIGHT} />}
                  {uniquePositioned.map((evt) => {
                    const top = `${evt.top}px`;
                    const height = `${evt.height}px`;
                    const group = byStart[evt.startTime];

                    // if there are multiple events with the same start time
                    if (group.length > 1) {
                      const index = group.findIndex((e) => e.id === evt.id);
                      const width = `calc((100% - 0.5rem) / ${group.length})`;
                      const left = `calc(${index} * ((100% - 0.5rem) / ${group.length}))`;
                      return (
                        <EventItem
                          key={`${evt.id}-${dayInfo.date}`}
                          event={{ ...evt, date: dayInfo.date }}
                          cellHeight={CELL_HEIGHT}
                          color={calendarColors[evt.calendarId]}
                          style={{ top, height, left, width }}
                        />
                      );
                    }

                    // otherwise — the only event in this cell: full width, top layer
                    return (
                      <EventItem
                        key={`${evt.id}-${dayInfo.date}`}
                        event={{ ...evt, date: dayInfo.date }}
                        cellHeight={CELL_HEIGHT}
                        color={calendarColors[evt.calendarId]}
                        style={{
                          top,
                          height,
                          left: 0,
                          width: "calc(100% - 0.5rem)",
                          zIndex: 1,
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
