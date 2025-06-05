import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SelectMenu from "./SelectMenu";
import styles from "./SelectMenu.module.css";

jest.mock("shared/hooks/useTimeOptions", () => {
  return () => ["11:45", "12:00"];
});

describe("SelectMenu Component", () => {
  const onTimeSelectMock = jest.fn();

  const defaultProps = {
    label: "Time",
    selectedTime: "11:45",
    onTimeSelect: onTimeSelectMock,
  };

  const renderSelectMenu = (props = {}) =>
    render(<SelectMenu {...defaultProps} {...props} />);

  const getInputBox = (container: HTMLElement): HTMLElement => {
    const inputBox = container.querySelector(`.${styles.inputBox}`);
    if (!(inputBox instanceof HTMLElement)) {
      throw new Error("Input box not found");
    }
    return inputBox;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders component with default props", () => {
    renderSelectMenu();
    expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
  });

  it("initializes selected time when provided", () => {
    renderSelectMenu();
    expect(screen.getByText(defaultProps.selectedTime)).toBeInTheDocument();
  });

  it("opens menu when input box is clicked and shows options", async () => {
    const { container } = renderSelectMenu();
    const inputBox = getInputBox(container);

    fireEvent.click(inputBox);

    await waitFor(() => {
      const options = container.querySelectorAll(`.${styles.option}`);
      expect(options.length).toBe(2);
      expect(options[0]).toHaveTextContent("11:45");
      expect(options[1]).toHaveTextContent("12:00");
    });
  });

  it("closes menu when input box is clicked again", async () => {
    const { container } = renderSelectMenu();
    const inputBox = getInputBox(container);

    fireEvent.click(inputBox);
    await waitFor(() =>
      expect(container.querySelector(`.${styles.menu}`)).toBeInTheDocument()
    );

    fireEvent.click(inputBox);
    await waitFor(() =>
      expect(container.querySelector(`.${styles.menu}`)).toBeNull()
    );
  });

  it("closes menu when clicking outside", async () => {
    const { container } = renderSelectMenu();
    const inputBox = getInputBox(container);

    fireEvent.click(inputBox);
    await waitFor(() =>
      expect(container.querySelector(`.${styles.menu}`)).toBeInTheDocument()
    );

    fireEvent.mouseDown(document.body);
    await waitFor(() =>
      expect(container.querySelector(`.${styles.menu}`)).toBeNull()
    );
  });

  it("selects option and calls onTimeSelect", async () => {
    const { container } = renderSelectMenu();
    const inputBox = getInputBox(container);

    fireEvent.click(inputBox);
    await waitFor(() =>
      expect(container.querySelector(`.${styles.menu}`)).toBeInTheDocument()
    );

    const options = container.querySelectorAll(`.${styles.option}`);
    const first = options[0] as HTMLElement;
    const text = first.textContent || "";

    fireEvent.click(first);

    await waitFor(() => {
      expect(onTimeSelectMock).toHaveBeenCalledWith(text);
      expect(inputBox).toHaveTextContent(text);
      expect(container.querySelector(`.${styles.menu}`)).toBeNull();
    });
  });
});
