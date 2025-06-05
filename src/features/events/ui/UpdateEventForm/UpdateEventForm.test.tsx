import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateEventForm from "./UpdateEventForm";
import { EventFormPayload } from "../EventForm/EventForm";

const updateEventMock = jest.fn();
jest.mock("features/events/api/hooks/useUpdateEvent", () => ({
  useUpdateEvent: () => ({
    updateEvent: updateEventMock,
    isLoading: false,
  }),
}));

jest.mock("app/appHooks", () => ({
  useAppSelector: () => ({
    uid: "user-1",
  }),
}));

jest.mock("features/calendars/api/hooks/useCalendars", () => ({
  useCalendars: () => ({
    data: [
      { id: "calendar-1", title: "Work", color: "#123456" },
      { id: "calendar-2", title: "Personal", color: "#654321" },
    ],
  }),
}));

jest.mock("../EventForm/repeatOptions", () => ({
  getRepeatOptions: (_date: string) => [
    { value: "none", label: "No repeat" },
    { value: "daily", label: "Daily" },
  ],
}));

const eventFormSubmitMock = jest.fn();
const eventFormCloseMock = jest.fn();
jest.mock("../EventForm/EventForm", () => ({
  EventForm: (props: any) => {
    eventFormSubmitMock.mockImplementation(props.onSubmit);
    eventFormCloseMock.mockImplementation(props.onClose);
    return (
      <div data-testid="event-form">
        <button
          data-testid="submit-button"
          onClick={() =>
            props.onSubmit &&
            props.onSubmit({
              ...props,
              title: "Changed Title",
            })
          }
        >
          Submit
        </button>
        <button
          data-testid="close-button"
          onClick={() => props.onClose && props.onClose()}
        >
          Close
        </button>
        <span>{props.title}</span>
      </div>
    );
  },
}));

function createEventFormPayload(
  override: Partial<EventFormPayload> = {}
): EventFormPayload {
  return {
    title: "Initial Title",
    date: new Date("2025-06-01"),
    startTime: "10:00",
    endTime: "11:00",
    calendarId: "calendar-1",
    repeat: "none",
    allDay: false,
    description: "Test description",
    ...override,
  };
}

describe("UpdateEventForm", () => {
  beforeEach(() => {
    updateEventMock.mockClear();
    eventFormSubmitMock.mockClear();
    eventFormCloseMock.mockClear();
  });

  it("should render EventForm with correct initial values and options", () => {
    render(
      <UpdateEventForm
        eventId="event-123"
        data={createEventFormPayload()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByTestId("event-form")).toBeInTheDocument();
    expect(screen.getByText("Initial Title")).toBeInTheDocument();
  });

  it("should generate correct repeat options based on date", () => {
    render(
      <UpdateEventForm
        eventId="event-123"
        data={createEventFormPayload({ date: new Date("2025-06-05") })}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByTestId("event-form")).toBeInTheDocument();
  });

  it("should call updateEvent and onClose on submit", async () => {
    const onCloseMock = jest.fn();
    render(
      <UpdateEventForm
        eventId="event-777"
        data={createEventFormPayload()}
        onClose={onCloseMock}
      />
    );

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() =>
      expect(updateEventMock).toHaveBeenCalledWith(
        "event-777",
        "calendar-1",
        expect.objectContaining({
          title: "Changed Title",
        })
      )
    );
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("should call onClose when close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(
      <UpdateEventForm
        eventId="event-888"
        data={createEventFormPayload()}
        onClose={onCloseMock}
      />
    );

    fireEvent.click(screen.getByTestId("close-button"));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
