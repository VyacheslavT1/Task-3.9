import { render, screen, fireEvent } from "@testing-library/react";
import DateTimeSelector from "./DateTimeSelector";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => (props: any) => <svg data-testid="clock-icon" {...props} />,
}));

let selectMenuCallCount = 0;

jest.mock("shared/ui/components", () => ({
  InputField: (props: any) => (
    <input data-testid="date-input" value={props.value} readOnly />
  ),
  DatePicker: ({ onDateSelect }: any) => (
    <button
      data-testid="date-picker"
      onClick={() => onDateSelect(new Date("2025-05-30"))}
    >
      Pick Date
    </button>
  ),
  SelectMenu: (props: any) => {
    selectMenuCallCount++;
    const testId = selectMenuCallCount === 1 ? "start-time" : "end-time";
    return (
      <select
        data-testid={testId}
        disabled={props.disabled}
        value={props.selectedTime}
        onChange={(e) => props.onTimeSelect(e.target.value)}
      >
        <option value="">--</option>
        <option value="10:00">10:00</option>
        <option value="12:00">12:00</option>
      </select>
    );
  },
}));

describe("DateTimeSelector", () => {
  beforeEach(() => {
    selectMenuCallCount = 0;
  });

  it("should render icon, input, and two SelectMenus", () => {
    render(
      <DateTimeSelector
        selectedDate={null}
        setSelectedDate={jest.fn()}
        timeStart=""
        setTimeStart={jest.fn()}
        timeEnd=""
        setTimeEnd={jest.fn()}
        isAllDay={false}
      />
    );
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
    expect(screen.getByTestId("date-input")).toBeInTheDocument();
    expect(screen.getByTestId("start-time")).toBeInTheDocument();
    expect(screen.getByTestId("end-time")).toBeInTheDocument();
  });

  it("should open and close DatePicker when input clicked and date selected", () => {
    const setSelectedDateMock = jest.fn();
    render(
      <DateTimeSelector
        selectedDate={null}
        setSelectedDate={setSelectedDateMock}
        timeStart=""
        setTimeStart={jest.fn()}
        timeEnd=""
        setTimeEnd={jest.fn()}
        isAllDay={false}
      />
    );
    fireEvent.click(screen.getByTestId("date-input"));
    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("date-picker"));
    expect(setSelectedDateMock).toHaveBeenCalledWith(new Date("2025-05-30"));
  });

  it("should call setTimeStart and setTimeEnd when select changes", () => {
    const setTimeStartMock = jest.fn();
    const setTimeEndMock = jest.fn();
    render(
      <DateTimeSelector
        selectedDate={new Date("2025-05-30")}
        setSelectedDate={jest.fn()}
        timeStart=""
        setTimeStart={setTimeStartMock}
        timeEnd=""
        setTimeEnd={setTimeEndMock}
        isAllDay={false}
      />
    );
    fireEvent.change(screen.getByTestId("start-time"), {
      target: { value: "10:00" },
    });
    expect(setTimeStartMock).toHaveBeenCalledWith("10:00");
    fireEvent.change(screen.getByTestId("end-time"), {
      target: { value: "12:00" },
    });
    expect(setTimeEndMock).toHaveBeenCalledWith("12:00");
  });

  it("should disable time selects if isAllDay is true", () => {
    render(
      <DateTimeSelector
        selectedDate={null}
        setSelectedDate={jest.fn()}
        timeStart=""
        setTimeStart={jest.fn()}
        timeEnd=""
        setTimeEnd={jest.fn()}
        isAllDay={true}
      />
    );
    expect(screen.getByTestId("start-time")).toBeDisabled();
    expect(screen.getByTestId("end-time")).toBeDisabled();
  });
});
