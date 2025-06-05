import { render, screen, fireEvent } from "@testing-library/react";
import Modal, { ModalProps } from "./Modal";
import styles from "./Modal.module.css";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="close-button" {...props} />
  ),
}));

describe("Modal Component", () => {
  const onCloseMock = jest.fn();

  const defaultProps: ModalProps = {
    isOpen: true,
    title: "Modal",
    onClose: onCloseMock,
    children: <div data-testid="modal-children">Modal Content</div>,
  };

  const renderModal = (props = {}) =>
    render(<Modal {...defaultProps} {...props} />);

  beforeEach(() => {
    onCloseMock.mockClear();
  });

  describe("Rendering", () => {
    it("shouldn't render when isOpen is false", () => {
      const { container } = renderModal({ isOpen: false });
      expect(container.firstChild).toBeNull();
    });

    it("should render when isOpen is true", () => {
      renderModal({ isOpen: true });

      expect(screen.getByText("Modal")).toBeInTheDocument();
      expect(screen.getByTestId("modal-children")).toBeInTheDocument();
    });

    it("should call onClose when the close button is clicked", () => {
      renderModal({ isOpen: true });
      const closeButton = screen.getByTestId("close-button");
      fireEvent.click(closeButton);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("should render content inside a dialog element", () => {
      renderModal({ isOpen: true });
      const dialog = screen.getByRole("dialog", { hidden: true });
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveClass(styles.modal);
    });

    it("should render children correctly", () => {
      renderModal({ isOpen: true });
      expect(screen.getByTestId("modal-children")).toHaveTextContent(
        "Modal Content"
      );
    });
  });
});
