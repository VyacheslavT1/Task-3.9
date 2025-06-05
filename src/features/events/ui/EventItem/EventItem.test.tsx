import { render, screen, fireEvent } from "@testing-library/react";
import EventItem from "./EventItem";
import { Event } from "features/events/api/hooks/useEvents";

const openModalMock = jest.fn();
const closeModalMock = jest.fn();
jest.mock("shared/ui/context/ModalContext", () => ({
  useModal: () => ({
    openModal: openModalMock,
    closeModal: closeModalMock,
  }),
}));

jest.mock("features/events/ui/EventInfoForm/EventInfoForm", () => ({
  EventInfoForm: (props: any) => (
    <div data-testid="event-info-form">{props.event.title}</div>
  ),
}));

function createEvent(override: Partial<Event> = {}): Event {
  return {
    id: "event-1",
    title: "Title 1",
    date: "2025-06-01",
    calendarId: "calendar-1",
    startTime: "09:00",
    endTime: "",
    repeat: "none",
    allDay: false,
    description: "",
    uid: "user-1",
    timestamp: 1,
    ...override,
  };
}

describe("EventItem", () => {
  beforeEach(() => {
    openModalMock.mockClear();
    closeModalMock.mockClear();
  });

  it("should render event title and start time if event is not allDay and has no endTime", () => {
    render(
      <EventItem
        event={createEvent({
          title: "Title 1",
          allDay: false,
          startTime: "09:00",
          endTime: "",
        })}
        color="#123456"
        cellHeight={80}
      />
    );
    expect(screen.getByText("Title 1, 09:00")).toBeInTheDocument();
  });

  it("should render only event title if event is allDay", () => {
    render(
      <EventItem
        event={createEvent({
          title: "Title 2",
          allDay: true,
          startTime: "",
          endTime: "",
        })}
        color="#ff0000"
        cellHeight={80}
      />
    );
    expect(screen.getByText("Title 2")).toBeInTheDocument();
  });

  it("should render event title and time range if event has endTime", () => {
    render(
      <EventItem
        event={createEvent({
          title: "Title 3",
          allDay: false,
          startTime: "12:00",
          endTime: "13:00",
        })}
        color="#00ff00"
        cellHeight={80}
      />
    );
    expect(screen.getByText("Title 3")).toBeInTheDocument();
    expect(screen.getByText("12:00 – 13:00")).toBeInTheDocument();
  });

  it("should apply merged styles including color", () => {
    render(
      <EventItem
        event={createEvent({
          title: "Title 4",
          allDay: false,
        })}
        color="#abcdef"
        cellHeight={80}
        style={{ top: 42 }}
      />
    );
    const eventElement = screen.getByTitle("Title 4");
    expect(eventElement).toHaveStyle({
      backgroundColor: "#abcdef4d",
      borderLeft: "4px solid #abcdef",
      top: "42px",
      position: "absolute",
    });
  });

  it("should add singleLine class if event is not allDay and has no endTime", () => {
    render(
      <EventItem
        event={createEvent({
          title: "Title 5",
          allDay: false,
          startTime: "14:00",
          endTime: "",
        })}
        color="#654321"
        cellHeight={80}
      />
    );
    const eventElement = screen.getByTitle("Title 5");
    expect(eventElement.className).toMatch(/singleLine/);
  });

  it("should NOT add singleLine class if event is allDay or has endTime", () => {
    render(
      <EventItem
        event={createEvent({
          title: "Title 6",
          allDay: false,
          startTime: "15:00",
          endTime: "16:00",
        })}
        color="#333333"
        cellHeight={80}
      />
    );
    const eventElement = screen.getByTitle("Title 6");
    expect(eventElement.className).not.toMatch(/singleLine/);
  });

  it("should call openModal with EventInfoForm and event data on click", () => {
    const eventData = createEvent({
      title: "Title 7",
      allDay: false,
      startTime: "10:30",
      endTime: "",
    });
    render(<EventItem event={eventData} color="#ff8800" cellHeight={80} />);
    fireEvent.click(screen.getByTitle("Title 7"));
    expect(openModalMock).toHaveBeenCalledWith(
      expect.any(Object),
      "Event information"
    );
  });
});
