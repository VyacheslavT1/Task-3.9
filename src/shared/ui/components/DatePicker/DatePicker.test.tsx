import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DatePicker, { DatePickerProps } from "./DatePicker";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => () => <svg data-testid="icon" />,
}));

describe("DatePicker Component", () => {
  const onDateSelectMock = jest.fn();

  const renderDatePicker = (props?: Partial<DatePickerProps>) => {
    const defaultProps: DatePickerProps = {
      onDateSelect: onDateSelectMock,
      ...props,
    };
    return render(<DatePicker {...defaultProps} />);
  };

  beforeEach(() => {
    onDateSelectMock.mockClear();
  });

  it("should render header with current month and year", () => {
    renderDatePicker();
    const now = new Date();
    const headerText = now.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    expect(screen.getByText(headerText)).toBeInTheDocument();
  });

  it("should display week days labels", () => {
    const { container } = renderDatePicker();

    const dayLabels = container.querySelectorAll(".dayLabel");
    expect(dayLabels).toHaveLength(7);

    const expectedLabels = ["S", "M", "T", "W", "T", "F", "S"];
    dayLabels.forEach((label, index) => {
      expect(label.textContent).toBe(expectedLabels[index]);
    });
  });

  it("should call onDateSelect while enable date is selected", async () => {
    renderDatePicker();

    const dayCells = screen.getAllByText("1");
    const enabledDayCells = dayCells.filter(
      (cell) => !cell.className.includes("disabled")
    );
    const dayCell = enabledDayCells[0];

    fireEvent.click(dayCell);
    await waitFor(() => {
      expect(onDateSelectMock).toHaveBeenCalledTimes(1);
    });
    const selectedDate: Date = onDateSelectMock.mock.calls[0][0];
    expect(selectedDate.getDate()).toBe(1);
  });

  it("shouldn't call onDateSelect while disabled day is clicked", () => {
    renderDatePicker();

    const dayCells = screen.getAllByText(/\d+/);
    const disabledDayCell = dayCells.find((cell) =>
      cell.className.includes("disabled")
    );
    if (disabledDayCell) {
      fireEvent.click(disabledDayCell);
      expect(onDateSelectMock).not.toHaveBeenCalled();
    }
  });

  it("should allow to navigate between months", async () => {
    renderDatePicker();

    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    const initialHeader = new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    expect(screen.getByText(initialHeader)).toBeInTheDocument();

    fireEvent.click(nextButton);
    const nextMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    );
    const nextHeader = nextMonth.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    await waitFor(() => {
      expect(screen.getByText(nextHeader)).toBeInTheDocument();
    });

    fireEvent.click(prevButton);
    expect(screen.getByText(initialHeader)).toBeInTheDocument();
  });

  it("should highlight the selected date", () => {
    const now = new Date();
    const selectedDate = new Date(now.getFullYear(), now.getMonth(), 20);
    renderDatePicker({ selectedDate });
    const dayCells = screen.getAllByText("20");

    const selectedCell = dayCells.find((cell) =>
      cell.className.includes("selected")
    );
    expect(selectedCell).toBeDefined();
  });
});
