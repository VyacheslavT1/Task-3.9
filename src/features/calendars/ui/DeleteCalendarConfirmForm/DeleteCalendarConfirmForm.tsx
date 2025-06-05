import React from "react";
import { DeleteConfirmForm } from "shared/ui/components";
import { useModal } from "shared/ui/context/ModalContext";
import { useDeleteCalendar } from "features/calendars/api/hooks/useDeleteCalendar";
import styles from "./DeleteCalendarConfirmForm.module.css";

const DeleteCalendarConfirmForm: React.FC<{
  id: string;
  title: string;
  onClose: () => void;
}> = ({ id, title, onClose }) => {
  const { deleteCalendar, isLoading } = useDeleteCalendar();
  const { closeModal, showToast } = useModal();

  return (
    <DeleteConfirmForm
      isLoading={isLoading}
      onCancel={onClose}
      onConfirm={async () => {
        await deleteCalendar(id);
        closeModal();
        showToast(`Calendar ${title} deleted`);
      }}
    >
      <p className={styles.confirmationRequest}>
        Are you sure you want to delete the calendar <strong>{title}</strong>?
        You’ll no longer have access to this calendar and its events.
      </p>
    </DeleteConfirmForm>
  );
};
export default DeleteCalendarConfirmForm;
