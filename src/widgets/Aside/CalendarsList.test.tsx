import { render, screen, fireEvent } from "@testing-library/react";
import CalendarList from "./CalendarsList";

jest.mock("shared/ui/components", () => ({
  Checkbox: (props: any) => (
    <label data-testid={`checkbox-${props.label}`}>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={() => props.onCheck()}
      />
      {props.label}
    </label>
  ),
}));

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => () => <svg data-testid="icon" />,
}));

jest.mock(
  "features/calendars/ui/CreateCalendarForm/CreateCalendarForm",
  () => (props: any) => (
    <div data-testid="create-calendar-form" onClick={props.onClose} />
  )
);
jest.mock(
  "features/calendars/ui/UpdateCalendarForm/UpdateCalendarForm",
  () => (props: any) => (
    <div data-testid="update-calendar-form">
      {props.id}-{props.title}-{props.color}
    </div>
  )
);
jest.mock(
  "features/calendars/ui/DeleteCalendarConfirmForm/DeleteCalendarConfirmForm",
  () => (props: any) => (
    <div data-testid="delete-calendar-form">
      {props.id}-{props.title}
    </div>
  )
);

const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
jest.mock("shared/ui/context/ModalContext", () => ({
  useModal: () => ({
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
  }),
}));

const mockToggleVisibility = jest.fn();
jest.mock("features/calendars/api/hooks/useToggleCalendarVisibility", () => ({
  useToggleCalendarVisibility: () => ({
    toggleVisibility: mockToggleVisibility,
  }),
}));

describe("CalendarList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens CreateCalendarForm modal when title is clicked", () => {
    const calendars = [
      { id: "cal1", title: "Work", color: "#fff", visible: true },
    ];
    render(<CalendarList calendars={calendars} onCloseModal={() => {}} />);
    const title = screen.getByText("My calendars");
    fireEvent.click(title);

    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.anything(),
      "Create calendar"
    );
  });

  it("renders a checkbox for each calendar and toggles visibility on change", () => {
    const calendars = [
      { id: "cal1", title: "Work", color: "#fff", visible: true },
      { id: "cal2", title: "Home", color: "#000", visible: false },
    ];
    render(<CalendarList calendars={calendars} onCloseModal={() => {}} />);

    const workCheckbox = screen
      .getByTestId("checkbox-Work")
      .querySelector("input") as HTMLInputElement;
    const homeCheckbox = screen
      .getByTestId("checkbox-Home")
      .querySelector("input") as HTMLInputElement;

    expect(workCheckbox.checked).toBe(true);
    expect(homeCheckbox.checked).toBe(false);

    fireEvent.click(workCheckbox);
    expect(mockToggleVisibility).toHaveBeenCalledWith("cal1", true);

    fireEvent.click(homeCheckbox);
    expect(mockToggleVisibility).toHaveBeenCalledWith("cal2", false);
  });

  it("opens UpdateCalendarForm modal when edit icon is clicked", () => {
    const calendars = [
      { id: "cal1", title: "Work", color: "#fff", visible: true },
    ];
    const { container } = render(
      <CalendarList calendars={calendars} onCloseModal={() => {}} />
    );

    const editSpan = container.querySelector(`.${"editIcon"}`) as HTMLElement;
    fireEvent.click(editSpan);

    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.anything(),
      "Edit calendar"
    );
  });

  it("does not open DeleteCalendarConfirmForm when there's only one calendar", () => {
    const calendars = [
      { id: "cal1", title: "Work", color: "#fff", visible: true },
    ];
    const { container } = render(
      <CalendarList calendars={calendars} onCloseModal={() => {}} />
    );
    const trashSpan = container.querySelector(`.${"trashIcon"}`) as HTMLElement;
    fireEvent.click(trashSpan);
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  it("opens DeleteCalendarConfirmForm modal when delete icon is clicked if multiple calendars", () => {
    const calendars = [
      { id: "cal1", title: "Work", color: "#fff", visible: true },
      { id: "cal2", title: "Home", color: "#000", visible: true },
    ];
    const { container } = render(
      <CalendarList calendars={calendars} onCloseModal={() => {}} />
    );

    const firstTrash = container.querySelectorAll(
      `.${"trashIcon"}`
    )[0] as HTMLElement;
    fireEvent.click(firstTrash);

    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.anything(),
      "Delete calendar"
    );
  });
});
