import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WelcomePage from "./WelcomePage";

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: (icon: string) => (props: any) => (
    <svg data-testid={icon} {...props} />
  ),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const signInWithGoogleMock = jest.fn();
jest.mock("features/auth/model/authService", () => ({
  signInWithGoogle: () => signInWithGoogleMock(),
}));

jest.mock("shared/ui/components/Button/Button", () => ({
  __esModule: true,
  default: (props: any) => (
    <button data-testid="button" {...props}>
      {props.children}
    </button>
  ),
}));

describe("WelcomePage", () => {
  beforeEach(() => {
    signInWithGoogleMock.mockReset();
    mockNavigate.mockReset();
  });

  it("should render LogoIcon, GoogleIcon, and button", () => {
    render(<WelcomePage />);

    expect(
      screen.getByTestId("shared/icons/logo.svg?react")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("shared/icons/google.svg?react")
    ).toBeInTheDocument();

    expect(screen.getByTestId("button")).toHaveTextContent(
      "Continue with Google"
    );
  });

  it("should call signInWithGoogle and navigate on successful signing", async () => {
    signInWithGoogleMock.mockResolvedValueOnce(undefined);
    render(<WelcomePage />);
    fireEvent.click(screen.getByTestId("button"));
    await waitFor(() => {
      expect(signInWithGoogleMock).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/weekView");
    });
  });

  it("should show error message if signing in fails", async () => {
    signInWithGoogleMock.mockRejectedValueOnce(new Error("fail"));
    render(<WelcomePage />);
    fireEvent.click(screen.getByTestId("button"));
    await waitFor(() => {
      expect(
        screen.getByText("Can't sinning in with Google. Try again.")
      ).toBeInTheDocument();
    });
  });
});
