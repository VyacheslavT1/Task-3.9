import { render, screen } from "@testing-library/react";
import CreateEventForm from "./CreateEventForm";

const eventFormMock = jest.fn();
jest.mock("../EventForm/EventForm", () => ({
  __esModule: true,
  EventForm: (props: any) => {
    eventFormMock(props);
    return <div data-testid="event-form-mock" />;
  },
}));

const createEventMock = jest.fn();
jest.mock("features/events/api/hooks/useCreateEvent", () => ({
  useCreateEvent: () => ({
    createEvent: createEventMock,
    isLoading: false,
  }),
}));

jest.mock("features/calendars/api/hooks/useCalendars", () => ({
  useCalendars: () => ({
    data: [
      { id: "1", title: "Work", color: "#111" },
      { id: "2", title: "Personal", color: "#222" },
    ],
  }),
}));

jest.mock("app/appHooks", () => ({
  useAppSelector: () => ({ uid: "user-123" }),
}));

jest.mock("../EventForm/repeatOptions", () => ({
  getRepeatOptions: () => [
    { label: "Never", value: "never" },
    { label: "Daily", value: "daily" },
  ],
}));

describe("CreateEventForm", () => {
  beforeEach(() => {
    eventFormMock.mockClear();
    createEventMock.mockClear();
  });

  it("should pass default props to EventForm", () => {
    render(<CreateEventForm onClose={jest.fn()} />);
    expect(screen.getByTestId("event-form-mock")).toBeInTheDocument();

    expect(eventFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "",
        date: null,
        startTime: "",
        endTime: "",
        calendarId: "",
        repeat: "never",
        allDay: false,
        description: "",
        calendarOptions: [
          { value: "1", label: "Work", color: "#111" },
          { value: "2", label: "Personal", color: "#222" },
        ],
        repeatOptions: [
          { label: "Never", value: "never" },
          { label: "Daily", value: "daily" },
        ],
        isLoading: false,
        onClose: expect.any(Function),
        onSubmit: expect.any(Function),
      })
    );
  });

  it("should override default props with initialValues", () => {
    render(
      <CreateEventForm
        onClose={jest.fn()}
        initialValues={{ title: "T", calendarId: "2", repeat: "daily" }}
      />
    );
    expect(eventFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "T",
        calendarId: "2",
        repeat: "daily",
      })
    );
  });

  it("should call createEvent on submit", () => {
    render(<CreateEventForm onClose={jest.fn()} />);
    const calledProps = eventFormMock.mock.calls[0][0];
    const payload = { title: "X", calendarId: "2" };
    calledProps.onSubmit(payload);
    expect(createEventMock).toHaveBeenCalledWith(payload);
  });

  it("should pass onClose callback as it is", () => {
    const onCloseMock = jest.fn();
    render(<CreateEventForm onClose={onCloseMock} />);
    const calledProps = eventFormMock.mock.calls[0][0];
    calledProps.onClose();
    expect(onCloseMock).toHaveBeenCalled();
  });
});
