import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropdown, { DropdownProps } from "./Dropdown";
import styles from "./Dropdown.module.css";

describe("Dropdown Component", () => {
  const onSelectMock = jest.fn();

  const setup = (props?: Partial<DropdownProps>) => {
    const defaultOptions = [
      { value: "Day", label: "Day" },
      { value: "Week", label: "Week" },
    ];
    const Wrapper: React.FC = () => {
      const [selected, setSelected] = React.useState(props?.value ?? "Week");
      const merged: DropdownProps = {
        options: defaultOptions,
        value: selected,
        onSelect: (value) => {
          setSelected(value);
          onSelectMock(value);
        },
        variant: "primary",
        ...props,
      };
      return <Dropdown {...merged} />;
    };
    return render(<Wrapper />);
  };

  beforeEach(() => {
    onSelectMock.mockClear();
  });

  it('renders default selected option "Week"', () => {
    setup();
    expect(screen.getByText("Week")).toBeInTheDocument();
  });
  it("does not open menu when disabled", async () => {
    const { container } = setup({ disabled: true });
    const inputBox = container.querySelector(`.${styles.inputBox}`);
    await userEvent.click(inputBox!);
    expect(container.querySelector(`.${styles.menu}`)).toBeNull();
  });
  it("renders placeholder when no options", () => {
    setup({ options: [], placeholder: "Choose..." });
    expect(screen.getByText("Choose...")).toBeInTheDocument();
  });

  it("toggles dropdown menu when input box is clicked", async () => {
    const { container } = setup();

    const inputBox = container.querySelector(`.${styles.inputBox}`);
    if (!(inputBox instanceof HTMLElement)) {
      throw new Error("Input box not found or not an HTMLElement");
    }
    await userEvent.click(inputBox);

    const menu = await waitFor(() =>
      container.querySelector(`.${styles.menu}`)
    );
    if (!(menu instanceof HTMLElement)) {
      throw new Error("Menu not found or not an HTMLElement");
    }

    expect(within(menu).getByText("Day")).toBeInTheDocument();
    expect(within(menu).getByText("Week")).toBeInTheDocument();
  });

  it("calls onSelect and updates selected when an option is clicked", async () => {
    const { container } = setup();

    const inputBox = container.querySelector(`.${styles.inputBox}`);
    if (!(inputBox instanceof HTMLElement)) {
      throw new Error("Input box not found or not an HTMLElement");
    }
    await userEvent.click(inputBox);

    const dayOption = await screen.findByText("Day");
    await userEvent.click(dayOption);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith("Day");

    await waitFor(() =>
      expect(container.querySelector(`.${styles.menu}`)).toBeNull()
    );

    expect(screen.getByText("Day")).toBeInTheDocument();
  });

  it("closes menu when clicking outside", async () => {
    const { container } = setup();

    const inputBox = container.querySelector(`.${styles.inputBox}`);
    if (!(inputBox instanceof HTMLElement)) {
      throw new Error("Input box not found or not an HTMLElement");
    }
    await userEvent.click(inputBox);
    await screen.findByText("Day");

    fireEvent.mouseDown(document.body);

    await waitFor(() =>
      expect(container.querySelector(`.${styles.menu}`)).toBeNull()
    );
  });
});
