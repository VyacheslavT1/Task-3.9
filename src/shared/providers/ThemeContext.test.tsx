import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button data-testid="toggle" onClick={toggleTheme}>
        Toggle
      </button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    document.body.removeAttribute("data-theme");
  });

  it("should render children", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">child</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("should provide initial theme and toggleTheme", () => {
    render(
      <ThemeProvider initialTheme="light">
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    act(() => {
      screen.getByTestId("toggle").click();
    });
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
  });

  it("should use system theme if no initialTheme is set", () => {
    const matchMediaMock = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
  });

  it("should update body data-theme attribute when theme changes", () => {
    render(
      <ThemeProvider initialTheme="light">
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(document.body.getAttribute("data-theme")).toBe("light");
    act(() => {
      screen.getByTestId("toggle").click();
    });
    expect(document.body.getAttribute("data-theme")).toBe("dark");
  });

  it("should throw if useTheme is called outside ThemeProvider", () => {
    function renderWithoutProvider() {
      render(<ThemeConsumer />);
    }
    expect(renderWithoutProvider).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
  });

  it("should react to system theme changes", () => {
    let listener: any = null;
    const fakeMediaQuery = {
      matches: false,
      addEventListener: (_event: string, cb: any) => {
        listener = cb;
      },
      removeEventListener: jest.fn(),
    };
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn(() => fakeMediaQuery),
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    act(() => {
      listener({ matches: true });
    });
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    act(() => {
      listener({ matches: false });
    });
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
  });
});
