import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TextArea from "./TextArea";

describe("TextArea Component", () => {
  const defaultProps = {
    title: "Description",
    value: "",
    placeholder: "Enter your text here",
    rows: 2,
    cols: 40,
    autoResize: true,
    onChange: jest.fn(),
  };

  const renderTextArea = (props = {}) => {
    return render(<TextArea {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering and initial display", () => {
    it("should render component with default props", () => {
      renderTextArea();
      const textarea = screen.getByRole("textbox");

      expect(textarea).toBeInTheDocument();
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(defaultProps.placeholder)
      ).toBeInTheDocument();
      expect(textarea).toHaveAttribute("rows", defaultProps.rows.toString());
      expect(textarea).toHaveAttribute("cols", defaultProps.cols.toString());
    });
  });

  describe("Auto-resize functionality", () => {
    it("should update textarea height on mount when autoResize is true", async () => {
      renderTextArea({ value: "Some text" });
      const textarea = screen.getByRole("textbox");

      Object.defineProperty(textarea, "scrollHeight", {
        value: 100,
        writable: true,
      });

      fireEvent.input(textarea);
      await waitFor(() => {
        expect(textarea.style.height).not.toBe("");
        expect(parseInt(textarea.style.height, 10)).toBeLessThanOrEqual(100);
        expect(parseInt(textarea.style.height, 10)).toBeGreaterThan(0);
      });
    });

    it("should not update textarea height on mount when autoResize is false", () => {
      renderTextArea({ value: "Some text", autoResize: false });
      const textarea = screen.getByRole("textbox");

      Object.defineProperty(textarea, "scrollHeight", {
        value: 100,
        writable: true,
      });

      expect(textarea.style.height).toBe("");
    });
  });

  describe("Handling onInput event", () => {
    it("should update textarea height when input event occurs", async () => {
      renderTextArea({ value: "Initial" });
      const textarea = screen.getByRole("textbox");

      Object.defineProperty(textarea, "scrollHeight", {
        value: 150,
        writable: true,
      });

      fireEvent.input(textarea);
      await waitFor(() => {
        expect(textarea.style.height).not.toBe("");
        expect(parseInt(textarea.style.height, 10)).toBeLessThanOrEqual(150);
        expect(parseInt(textarea.style.height, 10)).toBeGreaterThan(0);
      });
    });
  });

  describe("Passing additional props", () => {
    it("should pass additional props to textarea", () => {
      const handleChange = jest.fn();
      renderTextArea({
        id: "my-textarea",
        onChange: handleChange,
        name: "description",
      });

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("id", "my-textarea");
      expect(textarea).toHaveAttribute("name", "description");

      fireEvent.change(textarea, { target: { value: "New value" } });
      expect(handleChange).toHaveBeenCalled();
    });
  });
});
