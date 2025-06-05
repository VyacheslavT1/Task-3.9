import React from "react";
import DeleteEventConfirmForm from "features/events/ui/DeleteEventConfirmForm/DeleteEventConfirmForm";
import UpdateEventForm from "features/events/ui/UpdateEventForm/UpdateEventForm";
import { useLazySVG } from "shared/hooks/useLazySVG";
import { useModal } from "shared/ui/context/ModalContext";
import { useCalendars } from "features/calendars/api/hooks/useCalendars";
import { useAppSelector } from "app/appHooks";
import { Event } from "features/events/api/hooks/useEvents";
import styles from "./EventInfoForm.module.css";

interface EventInfoFormProps {
  event: Event;
  onClose: () => void;
}

export const EventInfoForm: React.FC<EventInfoFormProps> = ({ event }) => {
  const EditIcon = useLazySVG("shared/icons/pen.svg?react");
  const TrashIcon = useLazySVG("shared/icons/trash-1.svg?react");
  const { openModal, closeModal } = useModal();

  const authUser = useAppSelector((state) => state.auth.user);
  const uid = authUser?.uid;
  const { data: calendars = [] } = useCalendars(uid);
  const calendar = calendars.find((cal) => cal.id === event.calendarId);
  const calendarTitle = calendar?.title || "";
  const calendarColor = calendar?.color || "";
  const ColorIndicatorIcon = useLazySVG("shared/icons/color.svg?react");
  const TitleIcon = useLazySVG("shared/icons/title.svg?react");
  const ClockIcon = useLazySVG("shared/icons/clock.svg?react");
  const CalendarIcon = useLazySVG("shared/icons/calendar.svg?react");
  const DescriptionIcon = useLazySVG("shared/icons/description.svg?react");

  const rawDate = event.date;
  const eventDate: Date =
    typeof rawDate === "string"
      ? new Date(rawDate)
      : typeof (rawDate as any).toDate === "function"
        ? (rawDate as any).toDate()
        : (rawDate as unknown as Date);

  const formattedDate = isNaN(eventDate.getTime())
    ? "Invalid Date"
    : eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
  const startDisplay = event.startTime ?? "";
  const endDisplay = event.endTime ?? "";
  const timeRange =
    event.allDay || !startDisplay
      ? ""
      : endDisplay
        ? `${startDisplay} – ${endDisplay}`
        : startDisplay;

  const handleEditClick = () => {
    closeModal();
    openModal(
      <UpdateEventForm
        eventId={event.id}
        data={{
          title: event.title,
          date: eventDate,
          startTime: event.startTime,
          endTime: event.endTime,
          calendarId: event.calendarId,
          repeat: event.repeat,
          allDay: event.allDay,
          description: event.description,
        }}
        onClose={closeModal}
      />,
      "Edit event"
    );
  };

  const handleDeleteClick = (id: string, title: string) => {
    openModal(
      <DeleteEventConfirmForm
        calendarId={event.calendarId}
        id={id}
        title={title}
        onClose={closeModal}
      />,
      "Delete event"
    );
  };

  return (
    <div className={styles.eventInfoForm}>
      <div className={styles.iconContainer}>
        {EditIcon && (
          <span className={styles.editIcon} onClick={handleEditClick}>
            <EditIcon />
          </span>
        )}
        {TrashIcon && (
          <span
            className={styles.trashIcon}
            onClick={() => handleDeleteClick(event.id, event.title)}
          >
            <TrashIcon />
          </span>
        )}
      </div>

      <div className={styles.eventInfoContainer}>
        {TitleIcon && (
          <div className={styles.eventTitle}>
            <TitleIcon />
            {event.title}
          </div>
        )}
        {ClockIcon && (
          <div className={styles.eventDate}>
            <ClockIcon />
            <div className={styles.eventDateAndTime}>
              {formattedDate}, {timeRange}
            </div>

            <div className={styles.allDayAndRepeat}>
              {event.allDay ? "All day," : ""} {event.repeat}
            </div>
          </div>
        )}

        {CalendarIcon && (
          <div className={styles.calendar}>
            <CalendarIcon />
            {ColorIndicatorIcon && (
              <ColorIndicatorIcon style={{ color: calendarColor }} />
            )}
            <span style={{ color: calendarColor }}>{calendarTitle}</span>
          </div>
        )}
        {DescriptionIcon && (
          <div className={styles.description}>
            <DescriptionIcon /> {event.description}
          </div>
        )}
      </div>
    </div>
  );
};
