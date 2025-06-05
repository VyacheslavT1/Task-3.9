import { render, screen, fireEvent } from "@testing-library/react";
import WeekView from "./WeekView";

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

jest.mock("shared/utils/computeWeekLayout", () => ({
  computeWeekLayout: (events: any, _cellHeight: number) =>
    events.map((event: any, idx: number) => ({
      ...event,
      top: 100 * idx,
      height: 80,
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
const mockWeekDays = [
  {
    date: "2025-06-02T00:00:00.000Z",
    dayOfMonth: 2,
    dayName: "Mon",
    isToday: false,
  },
  {
    date: "2025-06-03T00:00:00.000Z",
    dayOfMonth: 3,
    dayName: "Tue",
    isToday: false,
  },
  {
    date: "2025-06-04T00:00:00.000Z",
    dayOfMonth: 4,
    dayName: "Wed",
    isToday: false,
  },
  {
    date: "2025-06-05T00:00:00.000Z",
    dayOfMonth: 5,
    dayName: "Thu",
    isToday: true,
  },
  {
    date: "2025-06-06T00:00:00.000Z",
    dayOfMonth: 6,
    dayName: "Fri",
    isToday: false,
  },
  {
    date: "2025-06-07T00:00:00.000Z",
    dayOfMonth: 7,
    dayName: "Sat",
    isToday: false,
  },
  {
    date: "2025-06-08T00:00:00.000Z",
    dayOfMonth: 8,
    dayName: "Sun",
    isToday: false,
  },
];
jest.mock("app/appHooks", () => ({
  useAppSelector: (selector: any) => {
    if (selector.name === "selectVisibleCalendarIds")
      return mockVisibleCalendarIds;
    if (selector.name === "selectCalendarColor") return mockCalendarColors;

    return mockWeekDays;
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
    date: "2025-06-05",
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
    date: "2025-06-05",
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

describe("WeekView", () => {
  beforeEach(() => {
    openModalMock.mockClear();
    closeModalMock.mockClear();
  });

  it("should render week days headers with correct date and day name", () => {
    render(<WeekView />);
    mockWeekDays.forEach((dayInfo) => {
      expect(
        screen.getByText(dayInfo.dayOfMonth.toString())
      ).toBeInTheDocument();
      expect(screen.getByText(dayInfo.dayName)).toBeInTheDocument();
    });
  });

  it("should highlight today in week", () => {
    render(<WeekView />);
    const todayLabel = screen.getByText("5").closest("[class*='dayLabel']");
    expect(todayLabel?.className).toMatch(/today/);
  });

  it("should render aside", () => {
    render(<WeekView />);
    expect(screen.getByTestId("aside")).toBeInTheDocument();
  });

  it("should render all-day events in correct allDayCell", () => {
    render(<WeekView />);
    const eventItems = screen.getAllByTestId("event-item");
    expect(eventItems.map((el) => el.textContent)).toContain("AllDay Event");
  });

  it("should render timed events in correct column", () => {
    render(<WeekView />);
    const eventItems = screen.getAllByTestId("event-item");
    expect(eventItems.map((el) => el.textContent)).toContain("Meeting");
  });

  it("should call openModal with CreateEventForm when hour cell is clicked", () => {
    render(<WeekView />);
    const hourCells = document.querySelectorAll("[class*='hourCell']");
    fireEvent.click(hourCells[0]);
    expect(openModalMock).toHaveBeenCalled();
    const modalArg = openModalMock.mock.calls[0][0];
    expect(modalArg.props.initialValues.startTime).toBe("08:00 AM");
  });

  it("should render TimeLine only in today's column", () => {
    render(<WeekView />);
    expect(screen.getAllByTestId("timeline")).toHaveLength(1);
  });
});
