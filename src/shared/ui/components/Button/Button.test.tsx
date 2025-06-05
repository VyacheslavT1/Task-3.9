import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";
import styles from "./Button.module.css";

describe("Button Component", () => {
  const buttonText = "Button";
  const iconTestId = "test-icon";
  const mockIcon = <svg data-testid={iconTestId} />;
  const mockHandleClick = jest.fn();

  describe("Rendering", () => {
    it("should render with required props", () => {
      render(<Button variant="primary">{buttonText}</Button>);
      const button = screen.getByRole("button", { name: buttonText });

      expect(button).toBeInTheDocument();
    });

    it("should correctly render provided children", () => {
      render(
        <Button variant="primary">
          <span data-testid="custom-child">Custom Content</span>
        </Button>
      );
      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply correct classes for primary variant", () => {
      render(<Button variant="primary">{buttonText}</Button>);
      expect(screen.getByRole("button")).toHaveClass(styles.primary);
    });

    it("should apply correct classes for secondary variant", () => {
      render(<Button variant="secondary">{buttonText}</Button>);
      expect(screen.getByRole("button")).toHaveClass(styles.secondary);
    });
  });

  describe("Icon", () => {
    it("should display an icon when the icon prop is provided", () => {
      render(
        <Button variant="primary" icon={mockIcon}>
          {buttonText}
        </Button>
      );
      expect(screen.getByTestId(iconTestId)).toBeInTheDocument();
    });

    it("shouldn't display an icon if the icon prop is missing", () => {
      render(<Button variant="primary">{buttonText}</Button>);
      expect(screen.queryByTestId(iconTestId)).not.toBeInTheDocument();
    });

    it("should place the icon correctly", () => {
      render(
        <Button variant="primary" icon={mockIcon}>
          {buttonText}
        </Button>
      );
      expect(screen.getByRole("button").firstChild).toHaveClass(styles.icon);
      expect(screen.getByRole("button").lastChild).toHaveTextContent(
        buttonText
      );
    });
  });

  describe("Disabled state", () => {
    it("should render as disabled when the disabled prop is provided", () => {
      render(
        <Button variant="primary" disabled>
          {buttonText}
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("shouldn't trigger onClick when disabled", async () => {
      render(
        <Button variant="primary" disabled onClick={mockHandleClick}>
          {buttonText}
        </Button>
      );
      await userEvent.click(screen.getByRole("button"));
      expect(mockHandleClick).not.toHaveBeenCalled();
    });
  });

  describe("Event handling", () => {
    it("should call onClick when clicked", async () => {
      render(
        <Button variant="primary" onClick={mockHandleClick}>
          {buttonText}
        </Button>
      );

      await userEvent.click(screen.getByRole("button"));
      expect(mockHandleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("HTML attributes and className prop", () => {
    it("should accept and applies standard HTML attributes", () => {
      render(
        <Button variant="primary" type="submit" aria-label="Custom label">
          {buttonText}
        </Button>
      );
      const button = screen.getByRole("button", { name: "Custom label" });
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should add custom classes from the className prop", () => {
      const customClass = "custom-class";
      render(
        <Button variant="primary" className={customClass}>
          {buttonText}
        </Button>
      );
      expect(screen.getByRole("button")).toHaveClass(customClass);
    });
  });
});
