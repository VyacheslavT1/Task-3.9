import { render, screen } from "@testing-library/react";
import CalendarSelector from "./CalendarSelector";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: (path: string) => (props: any) => (
    <svg data-testid={path} {...props} />
  ),
}));

const dropdownMock = jest.fn();
jest.mock("shared/ui/components", () => ({
  Dropdown: (props: any) => {
    dropdownMock(props);
    return <div data-testid="dropdown" />;
  },
}));

describe("CalendarSelector", () => {
  beforeEach(() => {
    dropdownMock.mockClear();
  });

  it("should render main icon and Dropdown", () => {
    render(
      <CalendarSelector
        calendarOptions={[
          { value: "1", label: "Work", color: "#fff" },
          { value: "2", label: "Personal", color: "#000" },
        ]}
        selectedCalendar="1"
        setSelectedCalendar={jest.fn()}
      />
    );

    expect(
      screen.getByTestId("shared/icons/calendar.svg?react")
    ).toBeInTheDocument();

    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
  });

  it("should call setSelectedCalendar with first option if none selected", () => {
    const setSelectedCalendarMock = jest.fn();
    render(
      <CalendarSelector
        calendarOptions={[
          { value: "1", label: "Work", color: "#fff" },
          { value: "2", label: "Personal", color: "#000" },
        ]}
        selectedCalendar=""
        setSelectedCalendar={setSelectedCalendarMock}
      />
    );

    expect(setSelectedCalendarMock).toHaveBeenCalledWith("1");
  });

  it("should pass value and onSelect to Dropdown", () => {
    const setSelectedCalendarMock = jest.fn();
    render(
      <CalendarSelector
        calendarOptions={[
          { value: "1", label: "Work", color: "#fff" },
          { value: "2", label: "Personal", color: "#000" },
        ]}
        selectedCalendar="2"
        setSelectedCalendar={setSelectedCalendarMock}
      />
    );

    expect(dropdownMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: "2",
        onSelect: setSelectedCalendarMock,
        options: expect.any(Array),
        disabled: false,
        label: "Calendar",
        placeholder: "Choose your calendar",
      })
    );
  });

  it("should disable Dropdown if no options", () => {
    render(
      <CalendarSelector
        calendarOptions={[]}
        selectedCalendar=""
        setSelectedCalendar={jest.fn()}
      />
    );

    expect(dropdownMock).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true })
    );
  });
});
