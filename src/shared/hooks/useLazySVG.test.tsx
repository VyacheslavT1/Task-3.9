import { renderHook, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react";
import { useLazySVG } from "./useLazySVG";
import type { SVGComponent } from "./useLazySVG";

jest.mock(
  "/src/shared/icons/success.svg?react",
  () => ({
    default: (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid="success-icon" {...props} />
    ),
  }),
  { virtual: true }
);

describe("useLazySVG hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load SVG component on successful import", async () => {
    const { result } = renderHook(() =>
      useLazySVG("shared/icons/success.svg?react")
    );

    expect(result.current).toBeNull();
    await waitFor(() => expect(result.current).not.toBeNull());
    const Icon = result.current as SVGComponent;
    const { container } = render(<Icon />);
    expect(
      container.querySelector('[data-testid="success-icon"]')
    ).toBeInTheDocument();
  });

  it("should return a component that renders nothing when import fails", async () => {
    const { result } = renderHook(() =>
      useLazySVG("shared/icons/nonexistent.svg?react")
    );

    await waitFor(() => expect(result.current).not.toBeNull());

    const Icon = result.current as SVGComponent;
    const { container } = render(<Icon />);

    expect(container.firstChild).toBeNull();
  });

  it("should not update state after unmounting", async () => {
    let resolveImport: (module: any) => void;
    const importPromise = new Promise((resolve) => {
      resolveImport = resolve;
    });

    jest.mock("/src/shared/icons/slow.svg?react", () => importPromise, {
      virtual: true,
    });
    jest.resetModules();

    const { result, unmount } = renderHook(() =>
      useLazySVG("shared/icons/slow.svg?react")
    );
    unmount();

    resolveImport!({ default: () => <svg data-testid="slow-icon" /> });
    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });
});
