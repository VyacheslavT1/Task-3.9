import { render, screen, fireEvent } from "@testing-library/react";
import CreateCalendarForm from "./CreateCalendarForm";

jest.mock("features/calendars/ui/CalendarForm/CalendarForm", () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      <div data-testid="calendar-form">
        <span data-testid="title">{props.title}</span>
        <span data-testid="color">{props.color}</span>
        <span data-testid="used-colors">
          {JSON.stringify(props.usedColors)}
        </span>
        <span data-testid="is-loading">{String(props.isLoading)}</span>
        <button
          data-testid="submit-btn"
          onClick={() => props.onSubmit("Test Title", "#abcdef")}
        >
          Submit
        </button>
        <button data-testid="close-btn" onClick={props.onClose}>
          Close
        </button>
      </div>
    </div>
  ),
}));

const createCalendarMock = jest.fn();
const useCreateCalendarMock = () => ({
  createCalendar: createCalendarMock,
  isLoading: false,
});
jest.mock("features/calendars/api/hooks/useCreateCalendar", () => ({
  useCreateCalendar: () => useCreateCalendarMock(),
}));

const calendarsMock = [
  { id: "1", color: "#111111" },
  { id: "2", color: "#222222" },
];
jest.mock("features/calendars/api/hooks/useCalendars", () => ({
  useCalendars: () => ({
    data: calendarsMock,
    isLoading: false,
    error: null,
  }),
}));

jest.mock("app/appHooks", () => ({
  useAppSelector: (cb: any) =>
    cb({ auth: { user: { uid: "user-1", email: "test@test.com" } } }),
}));

describe("CreateCalendarForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should pass correct props to CalendarForm", () => {
    render(<CreateCalendarForm onClose={jest.fn()} />);
    // Проверяем начальные значения
    expect(screen.getByTestId("title")).toHaveTextContent("");
    expect(screen.getByTestId("color")).toHaveTextContent("");
    expect(screen.getByTestId("used-colors")).toHaveTextContent(
      JSON.stringify(["#111111", "#222222"])
    );
    expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
  });

  it("should call createCalendar with form data when onSubmit is called", () => {
    render(<CreateCalendarForm onClose={jest.fn()} />);
    // Кликаем по submit
    fireEvent.click(screen.getByTestId("submit-btn"));
    // Проверяем, что вызван createCalendar с правильными аргументами
    expect(createCalendarMock).toHaveBeenCalledWith({
      title: "Test Title",
      color: "#abcdef",
    });
  });

  it("should call onClose when close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(<CreateCalendarForm onClose={onCloseMock} />);
    fireEvent.click(screen.getByTestId("close-btn"));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
