import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputField, { InputType } from "./InputField";
import styles from "./InputField.module.css";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => () => <svg data-testid="mock-svg-icon" />,
}));

describe("InputField Component", () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    id: "username",
    label: "Username*",
    type: InputType.Text,
    value: "",
    placeholder: "placeholder",
    onChange: mockOnChange,
  };

  const renderInputField = (props = {}) =>
    render(<InputField {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render a TEXT input with correct type and without password toggle icon", () => {
      renderInputField({ type: InputType.Text });
      const inputField = screen.getByLabelText(defaultProps.label);
      expect(inputField).toBeInTheDocument();
      expect(inputField).toHaveAttribute("type", "text");
      expect(screen.queryByLabelText("Show password")).not.toBeInTheDocument();
    });

    it("should render a PASSWORD input with correct type and show the toggle icon", () => {
      renderInputField({ type: InputType.Password });
      const inputField = screen.getByLabelText(defaultProps.label);
      expect(inputField).toBeInTheDocument();
      expect(inputField).toHaveAttribute("type", "password");
      expect(screen.queryByLabelText("Show password")).toBeInTheDocument();
    });

    it("should render the label text correctly", () => {
      renderInputField();
      expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
    });

    it("should set correct id and placeholder attributes on the input", () => {
      renderInputField({
        id: "username",
        label: "Username*",
        placeholder: "Enter your username",
      });
      const inputField = screen.getByLabelText("Username*");
      expect(inputField).toHaveAttribute("id", "username");
      expect(inputField).toHaveAttribute("placeholder", "Enter your username");
    });
  });

  describe("Toggle Password Visibility", () => {
    it("should toggle input type from PASSWORD to TEXT and back on icon click", async () => {
      renderInputField({ type: InputType.Password });
      const inputField = screen.getByLabelText(defaultProps.label);
      const icon = screen.getByLabelText("Show password");

      await userEvent.click(icon);
      expect(inputField).toHaveAttribute("type", "text");
      expect(screen.queryByLabelText("Hide password")).toBeInTheDocument();

      await userEvent.click(icon);
      expect(inputField).toHaveAttribute("type", "password");
      expect(screen.queryByLabelText("Show password")).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("should disable the input when disabled prop is true (TEXT input)", () => {
      renderInputField({ type: InputType.Text, disabled: true });
      const input = screen.getByLabelText(defaultProps.label);
      expect(input).toHaveAttribute("disabled");
    });

    it("should not toggle password visibility when input is disabled (PASSWORD input)", async () => {
      renderInputField({ type: InputType.Password, disabled: true });
      const inputField = screen.getByLabelText(defaultProps.label);
      const icon = screen.getByLabelText("Show password");

      await userEvent.click(icon);

      expect(inputField).toHaveAttribute("type", "password");
      expect(screen.queryByLabelText("Hide password")).not.toBeInTheDocument();
    });

    it("should apply correct disabled styles for TEXT input", () => {
      renderInputField({ type: InputType.Text, disabled: true });
      const input = screen.getByLabelText(defaultProps.label);
      const container = input.closest(`.${styles.inputField}`);
      expect(container).toHaveClass(styles.disabledUsername);
    });

    it("should apply correct disabled styles for PASSWORD input", () => {
      renderInputField({ type: InputType.Password, disabled: true });
      const input = screen.getByLabelText(defaultProps.label);
      const container = input.closest(`.${styles.inputField}`);
      expect(container).toHaveClass(styles.disabledPassword);
    });
  });

  describe("Error Handling", () => {
    it("should render error message and set aria attributes when hasError is true", () => {
      renderInputField({ hasError: true, id: "username" });
      const id = "username";
      const input = screen.getByLabelText(defaultProps.label);
      const errorMessageContainer = screen.getByText("Error message");

      expect(errorMessageContainer).toBeInTheDocument();
      expect(errorMessageContainer).toHaveClass(styles.errorMessage);
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", `${id}-error`);
    });
  });

  describe("Events", () => {
    it("calls onChange handler when input value changes", () => {
      renderInputField({ onChange: mockOnChange });
      const input = screen.getByLabelText(defaultProps.label);

      fireEvent.change(input, { target: { value: "some text" } });
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });
});
