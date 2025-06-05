import React, { createContext, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { Modal, Toast } from "shared/ui/components";

interface ModalContextValue {
  openModal: (content: React.ReactNode, title: string) => void;
  closeModal: () => void;
  showToast: (message: string) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (message: string) => setToastMessage(message);

  const openModal = (content: React.ReactNode, title: string) => {
    setContent(content);
    setTitle(title);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, showToast }}>
      {children}
      {toastMessage &&
        ReactDOM.createPortal(
          <Toast
            message={toastMessage}
            duration={3000}
            onClose={() => setToastMessage(null)}
          />,
          document.body
        )}
      <Modal isOpen={isOpen} title={title} onClose={closeModal}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextValue => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be called inside ModalProvider");
  }
  return ctx;
};
