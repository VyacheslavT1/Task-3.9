import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorPicker from "./ColorPicker";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: (iconPath: string) => {
    const UnselectedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
      <svg data-testid="mock-unselected-icon" {...props} />
    );
    const SelectedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
      <svg data-testid="mock-selected-icon" {...props} />
    );
    return iconPath.includes("color-selected") ? SelectedIcon : UnselectedIcon;
  },
}));

describe("ColorPicker Component", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    colors: ["color1", "color2"],
    label: "color",
    onSelect: mockOnSelect,
  };

  const renderColorPicker = (props = {}) =>
    render(<ColorPicker {...defaultProps} {...props} />);

  describe("Rendering", () => {
    it("renders with default props", async () => {
      renderColorPicker();

      await waitFor(() => {
        expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
      });
    });
  });

  describe("Interactions", () => {
    it("applies selected icon on click", async () => {
      renderColorPicker();

      const firstOption = await screen.findByRole("img", {
        name: `Color ${defaultProps.colors[0]}`,
      });

      await userEvent.click(firstOption);

      await waitFor(() => {
        expect(
          within(firstOption).getByTestId("mock-selected-icon")
        ).toBeInTheDocument();
      });
    });

    it("toggles icons between options", async () => {
      renderColorPicker();

      const [firstOption, secondOption] = await screen.findAllByRole("img");

      // Сначала кликаем по первому и ждём его выделения
      await userEvent.click(firstOption);
      await waitFor(() => {
        expect(
          within(firstOption).getByTestId("mock-selected-icon")
        ).toBeInTheDocument();
        expect(
          within(secondOption).getByTestId("mock-unselected-icon")
        ).toBeInTheDocument();
      });

      // Потом кликаем по второму и ждём переключения
      await userEvent.click(secondOption);
      await waitFor(() => {
        expect(
          within(firstOption).getByTestId("mock-unselected-icon")
        ).toBeInTheDocument();
        expect(
          within(secondOption).getByTestId("mock-selected-icon")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes", async () => {
      renderColorPicker();

      const icons = await screen.findAllByRole("img");

      icons.forEach((icon, index) => {
        expect(icon).toHaveAttribute(
          "aria-label",
          `Color ${defaultProps.colors[index]}`
        );
      });
    });

    it("calls onSelect with correct color", async () => {
      renderColorPicker();

      const icons = await screen.findAllByRole("img");
      await userEvent.click(icons[0]);
      expect(mockOnSelect).toHaveBeenCalledWith(defaultProps.colors[0]);
    });

    it("renders without errors when colors array is empty", async () => {
      renderColorPicker({ colors: [] });
      expect(screen.queryByRole("img")).toBeNull();
    });

    it("renders label correctly", async () => {
      renderColorPicker();
      expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
    });

    it("handles multiple clicks on the same icon gracefully", async () => {
      renderColorPicker();

      const [firstOption] = await screen.findAllByRole("img");

      await userEvent.click(firstOption);
      await waitFor(() => {
        expect(
          within(firstOption).getByTestId("mock-selected-icon")
        ).toBeInTheDocument();
      });

      await userEvent.click(firstOption);
      await waitFor(() => {
        expect(
          within(firstOption).getByTestId("mock-selected-icon")
        ).toBeInTheDocument();
      });

      expect(mockOnSelect).toHaveBeenCalledTimes(2);
    });
  });
});
