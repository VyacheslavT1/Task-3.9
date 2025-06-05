import React from "react";
import { Event } from "features/events/api/hooks/useEvents";
import { useModal } from "shared/ui/context/ModalContext";
import { EventInfoForm } from "features/events/ui/EventInfoForm/EventInfoForm";
import styles from "./EventItem.module.css";
interface EventItemProps {
  event: Event;
  cellHeight: number;
  color: string;
  style?: React.CSSProperties;
}

const EventItem: React.FC<EventItemProps> = ({ event, color, style = {} }) => {
  const mergedStyle: React.CSSProperties = {
    position: "absolute",
    backgroundColor: `${color}4d`,
    borderLeft: `4px solid ${color}`,
    ...style,
  };

  const { openModal, closeModal } = useModal();
  const handleClick = () => {
    openModal(
      <EventInfoForm event={event} onClose={closeModal} />,
      "Event information"
    );
  };

  const isSingleLine = !event.allDay && !event.endTime;

  return (
    <div
      className={`${styles.eventItem} ${isSingleLine ? styles.singleLine : ""}`}
      style={mergedStyle}
      onClick={handleClick}
      title={event.title}
    >
      <span className={styles.title}>
        {event.title}
        {!event.allDay && !event.endTime && `, ${event.startTime}`}
      </span>
      {!event.allDay && event.endTime && (
        <span className={styles.timeRange}>
          {event.startTime} – {event.endTime}
        </span>
      )}
    </div>
  );
};

export default EventItem;
