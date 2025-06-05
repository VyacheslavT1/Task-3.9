import React from "react";
import { Checkbox } from "shared/ui/components";
import { useLazySVG } from "shared/hooks/useLazySVG";
import { useModal } from "shared/ui/context/ModalContext";
import { useToggleCalendarVisibility } from "features/calendars/api/hooks/useToggleCalendarVisibility";
import CreateCalendarForm from "features/calendars/ui/CreateCalendarForm/CreateCalendarForm";
import UpdateCalendarForm from "features/calendars/ui/UpdateCalendarForm/UpdateCalendarForm";
import DeleteCalendarConfirmForm from "features/calendars/ui/DeleteCalendarConfirmForm/DeleteCalendarConfirmForm";
import styles from "./Aside.module.css";

interface CalendarListProps {
  calendars: {
    id: string;
    title: string;
    color: string;
    visible: boolean;
  }[];
  onCloseModal: () => void;
}

const CalendarList: React.FC<CalendarListProps> = ({
  calendars,
  onCloseModal,
}) => {
  const { toggleVisibility } = useToggleCalendarVisibility();
  const { openModal } = useModal();

  const PlusIcon = useLazySVG("shared/icons/plus.svg?react");
  const EditIcon = useLazySVG("shared/icons/pen.svg?react");
  const TrashIcon = useLazySVG("shared/icons/trash-1.svg?react");

  const handleDeleteClick = (id: string, title: string) => {
    openModal(
      <DeleteCalendarConfirmForm
        id={id}
        title={title}
        onClose={onCloseModal}
      />,
      "Delete calendar"
    );
  };

  return (
    <div className={styles.myCalendars}>
      <h3
        className={styles.title}
        onClick={() =>
          openModal(
            <CreateCalendarForm onClose={onCloseModal} />,
            "Create calendar"
          )
        }
      >
        My calendars
        {PlusIcon && <PlusIcon />}
      </h3>

      <div className={styles.calendarsList}>
        {calendars.map((cal) => {
          const isOnlyOne = calendars.length === 1;
          return (
            <div key={cal.id} className={styles.calendarItem}>
              <Checkbox
                variant="labeled"
                label={cal.title}
                checked={cal.visible}
                onCheck={() => toggleVisibility(cal.id, cal.visible)}
                color={cal.color}
              />

              <div className={styles.iconContainer}>
                {EditIcon && (
                  <span
                    className={styles.editIcon}
                    onClick={() =>
                      openModal(
                        <UpdateCalendarForm
                          onClose={onCloseModal}
                          id={cal.id}
                          title={cal.title}
                          color={cal.color}
                        />,
                        "Edit calendar"
                      )
                    }
                  >
                    <EditIcon />
                  </span>
                )}

                {TrashIcon && (
                  <span
                    className={`${styles.trashIcon} ${
                      isOnlyOne ? styles.disabled : ""
                    }`}
                    onClick={() => {
                      if (!isOnlyOne) {
                        handleDeleteClick(cal.id, cal.title);
                      }
                    }}
                  >
                    <TrashIcon />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CalendarList;
