import React, { useEffect } from "react";
import { useLazySVG } from "shared/hooks/useLazySVG";
import styles from "./Toast.module.css";

export interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  duration,
  onClose,
  ...props
}) => {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const CloseButton = useLazySVG("shared/icons/close.svg?react");

  return (
    <div className={styles.toast} role="alert" {...props}>
      <p className={styles.message}>
        {message}
        {CloseButton && (
          <CloseButton
            className={styles.closeButton}
            onClick={onClose}
          ></CloseButton>
        )}
      </p>
    </div>
  );
};

export default Toast;
