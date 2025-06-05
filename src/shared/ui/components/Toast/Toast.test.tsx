import { render, screen, fireEvent, act } from "@testing-library/react";
import Toast, { ToastProps } from "./Toast";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="close-button" {...props} />
  ),
}));

describe("Toast Component", () => {
  const onCloseMock = jest.fn();

  const defaultProps: ToastProps = {
    message: "Test message",
    duration: 3000,
    onClose: onCloseMock,
  };

  const renderToast = (props = {}) => {
    return render(<Toast {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render toast with message and alert role", () => {
      renderToast();
      const toastElement = screen.getByRole("alert");

      expect(toastElement).toBeInTheDocument();
      expect(toastElement).toHaveTextContent(defaultProps.message);
    });
  });

  describe("Auto close functionality", () => {
    it("should call onClose after duration", () => {
      jest.useFakeTimers();
      renderToast({ duration: 3000 });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });
  });

  describe("Manual close", () => {
    it("should call onClose when close button is clicked", () => {
      renderToast({ duration: undefined });

      const closeButton = screen.getByTestId("close-button");
      fireEvent.click(closeButton);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });
});
