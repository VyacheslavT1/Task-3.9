import React from "react";
import Button from "shared/ui/components/Button/Button";
import styles from "./DeleteConfirmForm.module.css";

interface DeleteConfirmFormProps {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

const DeleteConfirmForm: React.FC<DeleteConfirmFormProps> = ({
  onConfirm,
  onCancel,
  isLoading = false,
  children,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.confirmForm}>
      {children}
      <div className={styles.actions}>
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          Delete
        </Button>
      </div>
    </form>
  );
};

export default DeleteConfirmForm;
