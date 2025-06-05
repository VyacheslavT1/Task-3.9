import { render, screen, fireEvent } from "@testing-library/react";
import ViewSwitcher from "./ViewSwitcher";

const mockOnSelect = jest.fn();
jest.mock("shared/ui/components", () => ({
  Dropdown: (props: any) => {
    return (
      <div>
        <span data-testid="current-value">{props.value}</span>
        <ul data-testid="options-list">
          {props.options.map((opt: any) => (
            <li
              key={opt.value}
              data-testid={`option-${opt.label}`}
              onClick={() => props.onSelect(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </div>
    );
  },
}));

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => () => <svg data-testid="down-icon" />,
}));

describe("ViewSwitcher Component", () => {
  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it("renders current value", () => {
    render(<ViewSwitcher value="/weekView" onChange={mockOnSelect} />);
    expect(screen.getByTestId("current-value").textContent).toBe("/weekView");
  });

  it("shows correct options and calls onChange when an option is clicked", () => {
    render(<ViewSwitcher value="/weekView" onChange={mockOnSelect} />);
    expect(screen.getByTestId("option-Week")).toBeInTheDocument();
    expect(screen.getByTestId("option-Day")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("option-Day"));
    expect(mockOnSelect).toHaveBeenCalledWith("/dayView");

    fireEvent.click(screen.getByTestId("option-Week"));
    expect(mockOnSelect).toHaveBeenCalledWith("/weekView");
  });

  it("updates displayed current value when prop changes", () => {
    const { rerender } = render(
      <ViewSwitcher value="/weekView" onChange={mockOnSelect} />
    );
    expect(screen.getByTestId("current-value").textContent).toBe("/weekView");

    rerender(<ViewSwitcher value="/dayView" onChange={mockOnSelect} />);
    expect(screen.getByTestId("current-value").textContent).toBe("/dayView");
  });
});
