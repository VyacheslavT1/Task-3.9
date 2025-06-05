import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { useAppSelector } from "app/appHooks";
import { shiftWeekByDays, setCurrentWeekDays } from "features/week/weekSlice";
import { setCurrentDate, shiftDateByDays } from "features/day/daySlice";
import { getWeekDays } from "shared/utils/getWeekDays";

jest.mock("./DateNav", () => (props: any) => (
  <div>
    <button data-testid="today-btn" onClick={props.onToday} />
    <button data-testid="prev-btn" onClick={props.onPrevious} />
    <button data-testid="next-btn" onClick={props.onNext} />
    <span data-testid="header-label">{props.headerLabel}</span>
  </div>
));

jest.mock("./ViewSwitcher", () => (props: any) => (
  <button
    data-testid="view-switcher"
    onClick={() =>
      props.onChange(props.value === "/dayView" ? "/weekView" : "/dayView")
    }
  >
    {props.value}
  </button>
));

jest.mock("./UserMenu", () => () => <div data-testid="user-menu" />);

jest.mock("shared/ui/components", () => ({
  Button: (props: any) => (
    <button data-testid="theme-btn" onClick={props.onClick}>
      {props.children}
    </button>
  ),
}));

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => () => <svg data-testid="icon" />,
}));

const mockNavigate = jest.fn();
let mockPathname = "/weekView";
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));

const mockToggleTheme = jest.fn();
jest.mock("shared/providers/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: mockToggleTheme,
  }),
}));

const mockDispatch = jest.fn();
jest.mock("app/appHooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: () => mockDispatch,
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correct headerLabel in weekView", () => {
    const mockWeekDays = getWeekDays(new Date("2025-06-04T00:00:00"));
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector.name === "useAppSelector") return;
      if (selector.toString().includes("root.weekView")) {
        return mockWeekDays;
      }
      return null;
    });

    render(<Header />);

    const label = screen.getByTestId("header-label").textContent;
    expect(label).toBe("June 2025");
  });

  it("renders correct headerLabel in dayView", () => {
    mockPathname = "/dayView";
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes("root.day")) {
        return new Date("2025-06-10T00:00:00").getTime();
      }
      return [];
    });

    render(<Header />);

    const label = screen.getByTestId("header-label").textContent;
    expect(label).toBe("June 2025");
  });

  it("dispatches setCurrentWeekDays and does not dispatch shift when Today clicked in weekView", () => {
    mockPathname = "/weekView";
    const mockWeek = getWeekDays(new Date());
    (useAppSelector as jest.Mock).mockReturnValue(mockWeek);

    render(<Header />);

    fireEvent.click(screen.getByTestId("today-btn"));
    expect(mockDispatch).toHaveBeenCalledWith(
      setCurrentWeekDays(getWeekDays(new Date()))
    );
    expect(mockDispatch).not.toHaveBeenCalledWith(shiftWeekByDays(-7));
  });

  it("dispatches shiftWeekByDays when Previous clicked in weekView", () => {
    mockPathname = "/weekView";
    (useAppSelector as jest.Mock).mockReturnValue(getWeekDays(new Date()));

    render(<Header />);

    fireEvent.click(screen.getByTestId("prev-btn"));
    expect(mockDispatch).toHaveBeenCalledWith(shiftWeekByDays(-7));
  });

  it("dispatches shiftWeekByDays when Next clicked in weekView", () => {
    mockPathname = "/weekView";
    (useAppSelector as jest.Mock).mockReturnValue(getWeekDays(new Date()));

    render(<Header />);

    fireEvent.click(screen.getByTestId("next-btn"));
    expect(mockDispatch).toHaveBeenCalledWith(shiftWeekByDays(7));
  });

  it("dispatches setCurrentDate when Today clicked in dayView", () => {
    mockPathname = "/dayView";
    (useAppSelector as jest.Mock).mockReturnValue(
      new Date("2025-06-10T00:00:00").getTime()
    );

    render(<Header />);

    fireEvent.click(screen.getByTestId("today-btn"));
    expect(mockDispatch).toHaveBeenCalledWith(
      setCurrentDate(expect.any(Number))
    );
  });

  it("dispatches shiftDateByDays when Previous clicked in dayView", () => {
    mockPathname = "/dayView";
    (useAppSelector as jest.Mock).mockReturnValue(
      new Date("2025-06-10T00:00:00").getTime()
    );

    render(<Header />);

    fireEvent.click(screen.getByTestId("prev-btn"));
    expect(mockDispatch).toHaveBeenCalledWith(shiftDateByDays(-1));
  });

  it("dispatches shiftDateByDays when Next clicked in dayView", () => {
    mockPathname = "/dayView";
    (useAppSelector as jest.Mock).mockReturnValue(
      new Date("2025-06-10T00:00:00").getTime()
    );

    render(<Header />);

    fireEvent.click(screen.getByTestId("next-btn"));
    expect(mockDispatch).toHaveBeenCalledWith(shiftDateByDays(1));
  });

  it("navigates and dispatches correct action when ViewSwitcher toggled from week → day", () => {
    mockPathname = "/weekView";
    (useAppSelector as jest.Mock).mockReturnValue(getWeekDays(new Date()));

    render(<Header />);

    fireEvent.click(screen.getByTestId("view-switcher"));
    expect(mockNavigate).toHaveBeenCalledWith("/dayView");
    expect(mockDispatch).toHaveBeenCalledWith(
      setCurrentDate(expect.any(Number))
    );
  });

  it("navigates and dispatches correct action when ViewSwitcher toggled from day → week", () => {
    mockPathname = "/dayView";
    (useAppSelector as jest.Mock).mockReturnValue(
      new Date("2025-06-10T00:00:00").getTime()
    );

    render(<Header />);

    fireEvent.click(screen.getByTestId("view-switcher"));
    expect(mockNavigate).toHaveBeenCalledWith("/weekView");
    expect(mockDispatch).toHaveBeenCalledWith(
      setCurrentWeekDays(getWeekDays(new Date()))
    );
  });

  it("toggles theme when theme button is clicked", () => {
    (useAppSelector as jest.Mock).mockReturnValue([]);
    render(<Header />);
    fireEvent.click(screen.getByTestId("theme-btn"));
    expect(mockToggleTheme).toHaveBeenCalled();
  });
});
