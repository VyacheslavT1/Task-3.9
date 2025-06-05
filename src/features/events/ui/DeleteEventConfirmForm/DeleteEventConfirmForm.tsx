import React from "react";
import { DeleteConfirmForm } from "shared/ui/components/";
import { useModal } from "shared/ui/context/ModalContext";
import { useDeleteEvent } from "features/events/api/hooks/useDeleteEvent";
import styles from "./DeleteEventConfirmForm.module.css";

interface DeleteEventConfirmFormProps {
  calendarId: string;
  id: string;
  title: string;
  onClose: () => void;
}

const DeleteEventConfirmForm: React.FC<DeleteEventConfirmFormProps> = ({
  calendarId,
  id,
  title,
  onClose,
}) => {
  const { deleteEvent, isLoading } = useDeleteEvent();
  const { closeModal, showToast } = useModal();

  return (
    <DeleteConfirmForm
      isLoading={isLoading}
      onCancel={onClose}
      onConfirm={async () => {
        await deleteEvent(calendarId, id);
        closeModal();
        showToast(`Event ${title} deleted`);
      }}
    >
      <p className={styles.confirmationRequest}>
        Are you sure you want to delete event <strong>{title}</strong>?
      </p>
    </DeleteConfirmForm>
  );
};
export default DeleteEventConfirmForm;
