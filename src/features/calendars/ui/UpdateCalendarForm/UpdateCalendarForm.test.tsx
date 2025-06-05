// src/features/calendars/ui/UpdateCalendarForm.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import UpdateCalendarForm from "./UpdateCalendarForm";

// Мокаем CalendarForm, чтобы контролировать пропсы и имитировать onSubmit/onClose
jest.mock("features/calendars/ui/CalendarForm/CalendarForm", () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      <span data-testid="title">{props.title}</span>
      <span data-testid="color">{props.color}</span>
      <span data-testid="used-colors">{JSON.stringify(props.usedColors)}</span>
      <span data-testid="is-loading">{String(props.isLoading)}</span>
      <button
        data-testid="submit-btn"
        onClick={() => props.onSubmit("Updated Title", "#fedcba")}
      >
        Submit
      </button>
      <button data-testid="close-btn" onClick={props.onClose}>
        Close
      </button>
    </div>
  ),
}));

const updateCalendarMock = jest.fn();
jest.mock("features/calendars/api/hooks/useUpdateCalendar", () => ({
  useUpdateCalendar: () => ({
    updateCalendar: updateCalendarMock,
    isLoading: false,
  }),
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

describe("UpdateCalendarForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should pass correct props to CalendarForm", () => {
    render(
      <UpdateCalendarForm
        id="cal-1"
        title="Work"
        color="#999999"
        onClose={jest.fn()}
      />
    );
    // Проверяем начальные значения
    expect(screen.getByTestId("title")).toHaveTextContent("Work");
    expect(screen.getByTestId("color")).toHaveTextContent("#999999");
    expect(screen.getByTestId("used-colors")).toHaveTextContent(
      JSON.stringify(["#111111", "#222222"])
    );
    expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
  });

  it("should call updateCalendar with correct arguments on submit", () => {
    render(
      <UpdateCalendarForm
        id="cal-1"
        title="Work"
        color="#999999"
        onClose={jest.fn()}
      />
    );
    // Кликаем Submit
    fireEvent.click(screen.getByTestId("submit-btn"));
    // Проверяем вызов
    expect(updateCalendarMock).toHaveBeenCalledWith("cal-1", {
      title: "Updated Title",
      color: "#fedcba",
    });
  });

  it("should call onClose when close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(
      <UpdateCalendarForm
        id="cal-2"
        title="Meetings"
        color="#abcdef"
        onClose={onCloseMock}
      />
    );
    fireEvent.click(screen.getByTestId("close-btn"));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
