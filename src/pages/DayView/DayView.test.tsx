import { render, screen, fireEvent } from "@testing-library/react";
import DayView from "./DayView";

jest.mock("widgets/Aside/Aside", () => () => <div data-testid="aside" />);

jest.mock("features/events/ui/EventItem/EventItem", () => (props: any) => (
  <div data-testid="event-item">{props.event.title}</div>
));

jest.mock(
  "features/events/ui/CreateEventForm/CreateEventForm",
  () => (props: any) => (
    <div data-testid="create-event-form">{props.initialValues?.startTime}</div>
  )
);

jest.mock("shared/ui/components", () => ({
  TimeLine: ({ cellHeight }: { cellHeight: number }) => (
    <div data-testid="timeline">{cellHeight}</div>
  ),
}));

jest.mock("shared/utils/eventOccursOnDay", () => ({
  eventOccursOnDay: jest.fn(() => true),
}));

jest.mock("shared/utils/computeDayLayout", () => ({
  computeDayLayout: (events: any, _cellHeight: number) =>
    events.map((event: any, idx: number) => ({
      ...event,
      top: 100 * idx,
      height: 80,
      columns: 2,
      column: idx % 2,
    })),
}));

jest.mock("shared/utils/getHours", () => ({
  getHours: () => [{ hour: "08 AM" }, { hour: "09 AM" }, { hour: "10 AM" }],
}));

const mockCalendarColors = {
  "calendar-1": "#aaa",
  "calendar-2": "#bbb",
};
const mockVisibleCalendarIds = ["calendar-1", "calendar-2"];
const mockCurrentDate = new Date("2025-06-02T09:00:00.000Z").getTime();
jest.mock("app/appHooks", () => ({
  useAppSelector: (selector: any) => {
    if (selector.name === "selectVisibleCalendarIds")
      return mockVisibleCalendarIds;
    if (selector.name === "selectCalendarColor") return mockCalendarColors;
    return mockCurrentDate;
  },
}));

jest.mock("features/calendars/selectors", () => ({
  selectVisibleCalendarIds: () => mockVisibleCalendarIds,
  selectCalendarColor: () => mockCalendarColors,
}));

const mockEvents = [
  {
    id: "event-1",
    title: "AllDay Event",
    allDay: true,
    calendarId: "calendar-1",
    date: "2025-06-02",
    startTime: "",
    endTime: "",
    repeat: "none",
    description: "",
    uid: "user-1",
    timestamp: 1,
  },
  {
    id: "event-2",
    title: "Meeting",
    allDay: false,
    calendarId: "calendar-2",
    date: "2025-06-02",
    startTime: "09:00",
    endTime: "10:00",
    repeat: "none",
    description: "",
    uid: "user-1",
    timestamp: 1,
  },
];
jest.mock("features/events/api/hooks/useEvents", () => ({
  useEvents: () => ({ events: mockEvents }),
}));

const openModalMock = jest.fn();
const closeModalMock = jest.fn();
jest.mock("shared/ui/context/ModalContext", () => ({
  useModal: () => ({
    openModal: openModalMock,
    closeModal: closeModalMock,
  }),
}));

describe("DayView", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-06-02T09:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    openModalMock.mockClear();
    closeModalMock.mockClear();
  });

  it("should render header with correct date and day name", () => {
    render(<DayView />);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
  });

  it("should highlight today if current date is today", () => {
    render(<DayView />);
    expect(document.querySelector("[class*='today']")).toBeTruthy();
  });

  it("should render aside", () => {
    render(<DayView />);
    expect(screen.getByTestId("aside")).toBeInTheDocument();
  });

  it("should render all-day events", () => {
    render(<DayView />);
    const eventItems = screen.getAllByTestId("event-item");
    expect(eventItems.map((el) => el.textContent)).toContain("AllDay Event");
  });

  it("should render timed events with correct props", () => {
    render(<DayView />);
    expect(screen.getAllByTestId("event-item")[1]).toHaveTextContent("Meeting");
  });

  it("should call openModal with CreateEventForm when hour cell is clicked", () => {
    render(<DayView />);
    const dayCells = document.querySelectorAll("[class*='dayCell']");
    fireEvent.click(dayCells[0]);
    expect(openModalMock).toHaveBeenCalled();
    const modalArg = openModalMock.mock.calls[0][0];
    expect(modalArg.props.initialValues.startTime).toBe("08:00 AM");
  });

  it("should render TimeLine only if today", () => {
    render(<DayView />);
    expect(screen.getByTestId("timeline")).toBeInTheDocument();
  });
});
