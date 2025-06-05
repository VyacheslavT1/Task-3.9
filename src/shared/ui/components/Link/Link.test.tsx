import { render, screen, fireEvent } from "@testing-library/react";
import Link from "./Link";
import styles from "./Link.module.css";

describe("Link Component", () => {
  const defaultProps = {
    href: "https://example.com",
    children: "Link",
  };

  const renderLink = (props = {}) =>
    render(<Link {...defaultProps} {...props} />);

  const onClickMock = jest.fn();

  it("should render anchor element with provided children and correct props when enabled", () => {
    renderLink();
    const linkElement = screen.getByRole("link", { name: /link/i });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", defaultProps.href);
    expect(linkElement).toHaveAttribute("aria-disabled", "false");
    expect(linkElement).toHaveAttribute("tabIndex", "0");
    expect(linkElement.className).toContain(styles.link);
    expect(linkElement.className).not.toContain(styles.disabled);
  });

  it("should render disabled link correctly", () => {
    renderLink({ disabled: true });
    const linkElement = screen.getByText(/link/i);

    expect(linkElement).not.toHaveAttribute("href");
    expect(linkElement).toHaveAttribute("aria-disabled", "true");
    expect(linkElement).toHaveAttribute("tabIndex", "-1");
    expect(linkElement.className).toContain(styles.link);
    expect(linkElement.className).toContain(styles.disabled);
  });

  it("should prevent default action when disabled link is clicked", () => {
    renderLink({ disabled: true });
    const linkElement = screen.getByText(/link/i);
    const preventDefaultSpy = jest.spyOn(Event.prototype, "preventDefault");

    fireEvent.click(linkElement);
    expect(preventDefaultSpy).toHaveBeenCalled();
    preventDefaultSpy.mockRestore();
  });

  it("should call onClick handler when link is not disabled", () => {
    renderLink({ onClick: onClickMock });
    const linkElement = screen.getByRole("link", { name: /link/i });

    fireEvent.click(linkElement);
    expect(onClickMock).toHaveBeenCalled();
  });

  it("should forward additional props to the anchor element", () => {
    renderLink({
      target: "_blank",
      rel: "noopener noreferrer",
      "data-testid": "custom-link",
    });
    const linkElement = screen.getByTestId("custom-link");
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
  });
});
