import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserMenu from "./UserMenu";
import { useAppSelector } from "app/appHooks";
import { signOut } from "firebase/auth";
import { auth } from "shared/api/firebase";
import { clearVisibleCalendarIds } from "features/calendars/calendarsSlice";

const mockDispatch = jest.fn();
jest.mock("app/appHooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: () => mockDispatch,
}));

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
}));
jest.mock("shared/api/firebase", () => ({
  auth: {},
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => () => <svg data-testid="logout-icon" />,
}));

describe("UserMenu Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders first letter of displayName when no photoURL", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      displayName: "Alice Smith",
    });
    render(<UserMenu />);

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders user photo when photoURL present", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      displayName: "Bob Brown",
      photoURL: "http://example.com/avatar.png",
    });
    render(<UserMenu />);

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe("http://example.com/avatar.png");
  });

  it("falls back to first letter when image fails to load", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      displayName: "Carol Johnson",
      photoURL: "http://example.com/invalid.png",
    });
    render(<UserMenu />);
    const img = screen.getByRole("img") as HTMLImageElement;
    fireEvent.error(img);
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("toggles logout button visibility when clicking on user container", () => {
    (useAppSelector as jest.Mock).mockReturnValue({ displayName: "David Lee" });
    render(<UserMenu />);
    expect(screen.queryByText("Logout")).toBeNull();

    const container = screen.getByText("D").closest("div") as HTMLElement;
    fireEvent.click(container);
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByTestId("logout-icon")).toBeInTheDocument();

    fireEvent.click(container);
    expect(screen.queryByText("Logout")).toBeNull();
  });

  it("calls signOut, dispatch, and navigate when clicking Logout", async () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      displayName: "Name Noname",
    });
    (signOut as jest.Mock).mockResolvedValue(undefined);

    render(<UserMenu />);
    const container = screen.getByText("N").closest("div") as HTMLElement;
    fireEvent.click(container);
    const logoutBtn = screen.getByText("Logout");
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth);
      expect(mockDispatch).toHaveBeenCalledWith(clearVisibleCalendarIds());
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
