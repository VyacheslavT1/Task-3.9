import { render } from "@testing-library/react";
import AuthProvider from "./AuthProvider";

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
}));
jest.mock("shared/api/firebase", () => ({
  auth: {},
}));
jest.mock("app/appHooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));
jest.mock("features/auth/model/authSlice", () => ({
  setUser: jest.fn((user) => ({ type: "setUser", payload: user })),
  clearUser: jest.fn(() => ({ type: "clearUser" })),
}));
jest.mock("features/calendars/api/hooks/useCalendars", () => ({
  useCalendars: jest.fn(),
}));

describe("AuthProvider", () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    require("app/appHooks").useAppDispatch.mockReturnValue(dispatchMock);
    require("app/appHooks").useAppSelector.mockImplementation(() => null);
    dispatchMock.mockClear();
    jest.clearAllMocks();
  });

  it("should subscribe to auth state changes and set user when logged in", () => {
    const fakeUser = {
      uid: "uid",
      email: "mail",
      displayName: "name",
      photoURL: "url",
    };
    const unsubscribeMock = jest.fn();
    require("firebase/auth").onAuthStateChanged.mockImplementation(
      (_auth: any, callback: any) => {
        callback(fakeUser);
        return unsubscribeMock;
      }
    );

    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    );

    expect(dispatchMock).toHaveBeenCalledWith({
      type: "setUser",
      payload: fakeUser,
    });
  });

  it("should clear user when logged out", () => {
    const unsubscribeMock = jest.fn();
    require("firebase/auth").onAuthStateChanged.mockImplementation(
      (_auth: any, callback: any) => {
        callback(null);
        return unsubscribeMock;
      }
    );

    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    );

    expect(dispatchMock).toHaveBeenCalledWith({ type: "clearUser" });
  });
});
