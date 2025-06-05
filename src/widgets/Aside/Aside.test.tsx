import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Aside from "./Aside";
import { useAppSelector } from "app/appHooks";
import { useCalendars } from "features/calendars/api/hooks/useCalendars";
import { setCurrentDate } from "features/day/daySlice";
import { setCurrentWeekDays } from "features/week/weekSlice";
import { getWeekDays } from "shared/utils/getWeekDays";

jest.mock("shared/ui/components", () => ({
  Button: (props: any) => (
    <button data-testid="button" onClick={props.onClick}>
      {props.children}
    </button>
  ),
  DatePicker: (props: any) => (
    <input
      data-testid="date-picker"
      type="date"
      onChange={(e) => props.onDateSelect(new Date(e.target.value))}
    />
  ),
}));

jest.mock("features/events/ui/CreateEventForm/CreateEventForm", () => () => (
  <div data-testid="create-form" />
));

jest.mock("./CalendarsList", () => (props: any) => (
  <div data-testid="calendar-list">{JSON.stringify(props.calendars)}</div>
));

const mockNavigate = jest.fn();
let mockPathname = "/weekView";
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => () => <svg data-testid="icon" />,
}));

const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
jest.mock("shared/ui/context/ModalContext", () => ({
  useModal: () => ({
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
  }),
}));

const mockDispatch = jest.fn();
jest.mock("app/appHooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: () => mockDispatch,
}));

jest.mock("features/calendars/api/hooks/useCalendars", () => ({
  useCalendars: jest.fn(),
}));

describe("Aside Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => {
      return { uid: "user-1" };
    });
  });

  it("shows loading state when calendars are loading", () => {
    (useCalendars as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });
    render(<Aside />);
    expect(screen.getByText("Loading calendars…")).toBeInTheDocument();
  });

  it("shows error state when calendars hook returns error", () => {
    (useCalendars as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: "Some error",
    });
    render(<Aside />);
    expect(screen.getByText("Error loading calendars")).toBeInTheDocument();
  });

  it("renders Button, DatePicker, and CalendarList with data when calendars loaded", () => {
    const mockCalendars = [
      { id: "cal1", title: "Work" },
      { id: "cal2", title: "Home" },
    ];
    (useCalendars as jest.Mock).mockReturnValue({
      data: mockCalendars,
      isLoading: false,
      error: null,
    });

    render(<Aside />);

    expect(screen.getByTestId("button")).toBeInTheDocument();
    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
    const list = screen.getByTestId("calendar-list");
    expect(list).toHaveTextContent(JSON.stringify(mockCalendars));
  });

  it("opens CreateEventForm modal when Create button is clicked", () => {
    (useCalendars as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    render(<Aside />);
    fireEvent.click(screen.getByTestId("button"));
    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.anything(),
      "Create event"
    );
  });

  it("dispatches setCurrentWeekDays and navigates to /weekView on date select in weekView", async () => {
    mockPathname = "/weekView";
    (useCalendars as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Aside />);

    fireEvent.change(screen.getByTestId("date-picker"), {
      target: { value: "2025-06-10" },
    });

    await waitFor(() => {
      const expectedWeek = getWeekDays(new Date("2025-06-10"));
      expect(mockDispatch).toHaveBeenCalledWith(
        setCurrentWeekDays(expectedWeek)
      );
      expect(mockNavigate).toHaveBeenCalledWith("/weekView");
    });
  });

  it("dispatches setCurrentDate and navigates to /dayView on date select in dayView", async () => {
    mockPathname = "/dayView";
    (useCalendars as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Aside />);

    fireEvent.change(screen.getByTestId("date-picker"), {
      target: { value: "2025-06-12" },
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setCurrentDate(new Date("2025-06-12").getTime())
      );
      expect(mockNavigate).toHaveBeenCalledWith("/dayView");
    });
  });
});
