import { render, screen, fireEvent } from "@testing-library/react";
import { EventInfoForm } from "./EventInfoForm";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: (icon: string) => (props: any) => (
    <svg data-testid={icon} {...props} />
  ),
}));

const openModalMock = jest.fn();
const closeModalMock = jest.fn();
jest.mock("shared/ui/context/ModalContext", () => ({
  useModal: () => ({
    openModal: openModalMock,
    closeModal: closeModalMock,
  }),
}));

jest.mock("features/calendars/api/hooks/useCalendars", () => ({
  useCalendars: () => ({
    data: [
      { id: "cal-1", title: "Work", color: "#123456", visible: true },
      { id: "cal-2", title: "Personal", color: "#abcdef", visible: true },
    ],
  }),
}));

jest.mock("app/appHooks", () => ({
  useAppSelector: () => ({ uid: "user-1" }),
}));

describe("EventInfoForm", () => {
  const event = {
    uid: "user-1",
    id: "event-1",
    title: "Test Event",
    date: "2025-06-03T10:00:00.000Z",
    startTime: "10:00",
    endTime: "12:00",
    calendarId: "cal-1",
    repeat: "Weekly",
    allDay: false,
    description: "Test description",
    timestamp: Date.now(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render event information correctly", () => {
    render(<EventInfoForm event={event} onClose={jest.fn()} />);
    expect(
      screen.getByTestId("shared/icons/pen.svg?react")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("shared/icons/trash-1.svg?react")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("shared/icons/title.svg?react")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("shared/icons/clock.svg?react")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("shared/icons/calendar.svg?react")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("shared/icons/color.svg?react")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("shared/icons/description.svg?react")
    ).toBeInTheDocument();
    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText(/Tuesday, June 3/i)).toBeInTheDocument();
    expect(screen.getByText(/10:00 – 12:00/i)).toBeInTheDocument();
    expect(screen.getByText(/Weekly/)).toBeInTheDocument();
    expect(screen.getByText(/Work/)).toBeInTheDocument();
    expect(screen.getByText(/Test description/)).toBeInTheDocument();
  });

  it("should call openModal with UpdateEventForm when EditIcon is clicked", () => {
    render(<EventInfoForm event={event} onClose={jest.fn()} />);
    fireEvent.click(screen.getByTestId("shared/icons/pen.svg?react"));
    expect(closeModalMock).toHaveBeenCalled();
    expect(openModalMock).toHaveBeenCalled();
    expect(openModalMock.mock.calls[0][1]).toBe("Edit event");
  });

  it("should call openModal with DeleteEventConfirmForm when TrashIcon is clicked", () => {
    render(<EventInfoForm event={event} onClose={jest.fn()} />);
    fireEvent.click(screen.getByTestId("shared/icons/trash-1.svg?react"));
    expect(openModalMock).toHaveBeenCalled();
    expect(openModalMock.mock.calls[0][1]).toBe("Delete event");
  });

  it("should display 'All day,' if event.allDay is true", () => {
    render(
      <EventInfoForm
        event={{ ...event, allDay: true, startTime: "", endTime: "" }}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText(/All day,/)).toBeInTheDocument();
  });
});
