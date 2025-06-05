import { createPortal } from "react-dom";
import React, { useEffect, useRef } from "react";
import { useLazySVG } from "shared/hooks/useLazySVG";
import styles from "./Modal.module.css";

export interface ModalProps
  extends React.DialogHTMLAttributes<HTMLDialogElement> {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  ...props
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const CloseButton = useLazySVG("shared/icons/close.svg?react");

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.showModal();
    } else if (!isOpen && modalRef.current) {
      modalRef.current.close();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <dialog ref={modalRef} className={styles.modal} {...props}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>
          {title}
          {CloseButton && (
            <CloseButton
              className={styles.closeButton}
              onClick={onClose}
            ></CloseButton>
          )}
        </h2>
      </div>
      <div className={styles.modalContext}>{children}</div>
    </dialog>,
    document.body
  );
};

export default Modal;
