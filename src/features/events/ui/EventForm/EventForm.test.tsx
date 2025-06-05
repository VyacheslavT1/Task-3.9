import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EventForm, EventFormProps } from "./EventForm";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => (props: any) => <svg data-testid="icon" {...props} />,
}));

jest.mock("shared/ui/components", () => ({
  InputField: (props: any) => (
    <input
      data-testid="title-input"
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  ),
  Checkbox: (props: any) => (
    <input
      type="checkbox"
      data-testid="all-day-checkbox"
      checked={props.checked}
      onChange={() => props.onCheck(!props.checked)}
    />
  ),
  Dropdown: (props: any) => (
    <select
      data-testid="repeat-dropdown"
      value={props.value}
      onChange={(e) => props.onSelect(e.target.value)}
      disabled={props.disabled}
    >
      {props.options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </select>
  ),
  TextArea: (props: any) => (
    <textarea
      data-testid="desc-input"
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  ),
  Button: (props: any) => (
    <button
      data-testid="save-btn"
      disabled={props.disabled}
      onClick={props.onClick}
      type={props.type}
    >
      {props.children}
    </button>
  ),
}));

jest.mock("features/events/ui/DateTimeSelector/DateTimeSelector", () => ({
  __esModule: true,
  default: ({
    selectedDate,
    setSelectedDate,
    timeStart,
    setTimeStart,
    timeEnd,
    setTimeEnd,
    isAllDay,
  }: any) => (
    <div data-testid="date-time-selector">
      <input
        data-testid="date-field"
        value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ""}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
        placeholder="date"
      />
      <input
        data-testid="start-time"
        value={timeStart}
        onChange={(e) => setTimeStart(e.target.value)}
        placeholder="start"
      />
      <input
        data-testid="end-time"
        value={timeEnd}
        onChange={(e) => setTimeEnd(e.target.value)}
        placeholder="end"
      />
      <span data-testid="all-day">{String(isAllDay)}</span>
    </div>
  ),
}));

jest.mock("features/events/ui/CalendarSelector/CalendarSelector", () => ({
  __esModule: true,
  default: ({
    calendarOptions,
    selectedCalendar,
    setSelectedCalendar,
  }: any) => (
    <select
      data-testid="calendar-select"
      value={selectedCalendar}
      onChange={(e) => setSelectedCalendar(e.target.value)}
    >
      {calendarOptions.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

const calendarOptions = [
  { value: "1", label: "Work", color: "#f00" },
  { value: "2", label: "Personal", color: "#0f0" },
];
const repeatOptions = [
  { value: "never", label: "Never" },
  { value: "daily", label: "Daily" },
];

const getDefaultProps = (
  override: Partial<EventFormProps> = {}
): EventFormProps => ({
  title: "",
  date: null,
  startTime: "",
  endTime: "",
  calendarId: "",
  repeat: "never",
  repeatOptions,
  allDay: false,
  description: "",
  calendarOptions,
  isLoading: false,
  onSubmit: jest.fn().mockResolvedValue(undefined),
  onClose: jest.fn(),
  ...override,
});

describe("EventForm", () => {
  it("should render all major fields and icons", () => {
    render(<EventForm {...getDefaultProps()} />);
    expect(screen.getByTestId("title-input")).toBeInTheDocument();
    expect(screen.getByTestId("desc-input")).toBeInTheDocument();
    expect(screen.getByTestId("calendar-select")).toBeInTheDocument();
    expect(screen.getByTestId("repeat-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("all-day-checkbox")).toBeInTheDocument();
    expect(screen.getAllByTestId("icon").length).toBeGreaterThan(0);
    expect(screen.getByTestId("save-btn")).toBeDisabled();
  });

  it("should enable Save button when all required fields filled", () => {
    render(
      <EventForm
        {...getDefaultProps({
          title: "New Event",
          date: new Date("2025-05-30"),
          calendarId: "1",
        })}
      />
    );
    expect(screen.getByTestId("save-btn")).not.toBeDisabled();
  });

  it("should call onSubmit with correct payload and then call onClose", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();
    render(
      <EventForm
        {...getDefaultProps({
          title: "Demo",
          date: new Date("2025-06-01"),
          calendarId: "1",
          onSubmit,
          onClose,
        })}
      />
    );
    fireEvent.change(screen.getByTestId("desc-input"), {
      target: { value: "Some description" },
    });
    fireEvent.click(screen.getByTestId("save-btn"));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Demo",
          date: new Date("2025-06-01"),
          calendarId: "1",
          description: "Some description",
        })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should update allDay value when checkbox is toggled", () => {
    render(
      <EventForm
        {...getDefaultProps({
          title: "Demo",
          date: new Date("2025-06-01"),
          calendarId: "1",
        })}
      />
    );
    const checkbox = screen.getByTestId("all-day-checkbox");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("should disable Save button when loading", () => {
    render(
      <EventForm
        {...getDefaultProps({
          title: "T",
          date: new Date("2025-06-01"),
          calendarId: "1",
          isLoading: true,
        })}
      />
    );
    expect(screen.getByTestId("save-btn")).toBeDisabled();
  });
});
