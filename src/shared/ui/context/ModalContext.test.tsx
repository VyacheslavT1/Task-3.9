import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalProvider, useModal } from "./ModalContext";

jest.mock("shared/ui/components", () => ({
  Modal: ({ isOpen, title, children, onClose }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <h1 data-testid="modal-title">{title}</h1>
        <div data-testid="modal-content">{children}</div>
        <button data-testid="modal-close" onClick={onClose}>
          CloseModal
        </button>
      </div>
    ) : null,

  Toast: ({ message, onClose }: any) => (
    <div data-testid="toast">
      <span data-testid="toast-message">{message}</span>
      <button data-testid="toast-close" onClick={onClose}>
        CloseToast
      </button>
    </div>
  ),
}));

const TestConsumer: React.FC = () => {
  const { openModal, closeModal, showToast } = useModal();

  return (
    <div>
      <button
        data-testid="open-modal-button"
        onClick={() =>
          openModal(<p data-testid="custom-content">Hello</p>, "My Title")
        }
      >
        Open Modal
      </button>
      <button data-testid="close-modal-button" onClick={closeModal}>
        Close Modal
      </button>
      <button
        data-testid="show-toast-button"
        onClick={() => showToast("Toast Msg")}
      >
        Show Toast
      </button>
    </div>
  );
};

describe("ModalProvider and useModal", () => {
  it("initially does not render Modal or Toast", () => {
    render(
      <ModalProvider>
        <TestConsumer />
      </ModalProvider>
    );
    expect(screen.queryByTestId("modal")).toBeNull();
    expect(screen.queryByTestId("toast")).toBeNull();
  });

  it("opens and closes Modal correctly", async () => {
    render(
      <ModalProvider>
        <TestConsumer />
      </ModalProvider>
    );

    fireEvent.click(screen.getByTestId("open-modal-button"));
    await waitFor(() =>
      expect(screen.getByTestId("modal")).toBeInTheDocument()
    );

    expect(screen.getByTestId("modal-title")).toHaveTextContent("My Title");
    expect(screen.getByTestId("custom-content")).toHaveTextContent("Hello");

    fireEvent.click(screen.getByTestId("modal-close"));

    await waitFor(() => expect(screen.queryByTestId("modal")).toBeNull());
  });

  it("closes the Modal when closeModal is called externally", async () => {
    render(
      <ModalProvider>
        <TestConsumer />
      </ModalProvider>
    );

    fireEvent.click(screen.getByTestId("open-modal-button"));
    await waitFor(() =>
      expect(screen.getByTestId("modal")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByTestId("close-modal-button"));
    await waitFor(() => expect(screen.queryByTestId("modal")).toBeNull());
  });

  it("shows and closes Toast correctly", async () => {
    render(
      <ModalProvider>
        <TestConsumer />
      </ModalProvider>
    );

    fireEvent.click(screen.getByTestId("show-toast-button"));
    await waitFor(() =>
      expect(screen.getByTestId("toast")).toBeInTheDocument()
    );
    expect(screen.getByTestId("toast-message")).toHaveTextContent("Toast Msg");
    fireEvent.click(screen.getByTestId("toast-close"));
    await waitFor(() => expect(screen.queryByTestId("toast")).toBeNull());
  });

  it("useModal throws error if used outside ModalProvider", () => {
    function renderWithoutProvider() {
      render(<TestConsumer />);
    }
    expect(renderWithoutProvider).toThrow(
      "useModal must be called inside ModalProvider"
    );
  });
});
