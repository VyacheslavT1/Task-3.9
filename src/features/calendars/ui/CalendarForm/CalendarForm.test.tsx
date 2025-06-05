import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CalendarForm from "./CalendarForm";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => (props: any) => <svg {...props} data-testid="icon" />,
}));

jest.mock("shared/ui/components", () => {
  const actual = jest.requireActual("shared/ui/components");
  return {
    ...actual,
    ColorPicker: ({ onSelect }: any) => (
      <div>
        <button onClick={() => onSelect("#123456")} data-testid="color-btn">
          Color
        </button>
      </div>
    ),
    InputField: (props: any) => (
      <input
        data-testid="input"
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    ),
    InputType: { Text: "text" },
    Button: (props: any) => <button {...props}>{props.children}</button>,
  };
});

describe("CalendarForm", () => {
  it("should render form with initial values", () => {
    render(
      <CalendarForm
        title="Initial Title"
        color="#abcdef"
        usedColors={["#123456"]}
        isLoading={false}
        onSubmit={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByTestId("input")).toHaveValue("Initial Title");
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getAllByTestId("icon").length).toBeGreaterThan(0);
  });

  it("should call onSubmit and onClose when form is submitted", async () => {
    const onSubmitMock = jest.fn().mockResolvedValue(undefined);
    const onCloseMock = jest.fn();

    render(
      <CalendarForm
        title=""
        color=""
        usedColors={[]}
        isLoading={false}
        onSubmit={onSubmitMock}
        onClose={onCloseMock}
      />
    );

    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "My Calendar" },
    });

    fireEvent.click(screen.getByTestId("color-btn"));
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(onSubmitMock).toHaveBeenCalledWith("My Calendar", "#123456")
    );
    await waitFor(() => expect(onCloseMock).toHaveBeenCalled());
  });

  it("should disable Save button if title or color is empty", () => {
    render(
      <CalendarForm
        title=""
        color=""
        usedColors={[]}
        isLoading={false}
        onSubmit={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });
  it("should disable Save button if color is empty", () => {
    render(
      <CalendarForm
        title="T"
        color=""
        usedColors={[]}
        isLoading={false}
        onSubmit={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });
});
