jest.mock("shared/api/firebase", () => ({
  auth: {},
}));
import { renderHook } from "@testing-library/react";
import { useCalendarsListener } from "./useCalendarsListener";

const getFirestoreMock = jest.fn();
const collectionMock = jest.fn();
const onSnapshotMock = jest.fn();
const onAuthStateChangedMock = jest.fn();
const dispatchMock = jest.fn();

jest.mock("firebase/firestore", () => ({
  getFirestore: () => getFirestoreMock(),
  collection: (...args: any[]) => collectionMock(...args),
  onSnapshot: (...args: any[]) => onSnapshotMock(...args),
}));
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args: any[]) => onAuthStateChangedMock(...args),
}));
jest.mock("react-redux", () => ({
  useDispatch: () => dispatchMock,
}));
jest.mock("features/calendars/calendarsSlice", () => ({
  setCalendars: jest.fn((list) => ({ type: "setCalendars", payload: list })),
}));

describe("useCalendarsListener", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should subscribe to auth changes and to calendar snapshot on login", () => {
    const unsubscribeSnapshot = jest.fn();
    const fakeSnapshot = {
      docs: [
        {
          id: "calendar-1",
          data: () => ({
            title: "Calendar",
            color: "#123",
            visible: true,
            uid: "user-1",
          }),
        },
      ],
    };

    onSnapshotMock.mockImplementation((_colRef, callback) => {
      callback(fakeSnapshot);
      return unsubscribeSnapshot;
    });
    collectionMock.mockReturnValue("col-ref");
    getFirestoreMock.mockReturnValue({});
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback({ uid: "user-1" });
      return jest.fn();
    });
    renderHook(() => useCalendarsListener());
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "setCalendars",
      payload: [
        {
          id: "calendar-1",
          title: "Calendar",
          color: "#123",
          visible: true,
          uid: "user-1",
        },
      ],
    });
    expect(onSnapshotMock).toHaveBeenCalled();
    expect(onAuthStateChangedMock).toHaveBeenCalled();
  });

  it("should unsubscribe from snapshot and clear calendars on logout", () => {
    const unsubscribeSnapshot = jest.fn();
    onSnapshotMock.mockReturnValue(unsubscribeSnapshot);
    collectionMock.mockReturnValue("col-ref");
    getFirestoreMock.mockReturnValue({});
    let authCallback: any = null;
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      authCallback = callback;
      return jest.fn();
    });

    renderHook(() => useCalendarsListener());
    if (authCallback) {
      authCallback({ uid: "user-1" });
    }
    if (authCallback) {
      authCallback(null);
    }

    expect(dispatchMock).toHaveBeenCalledWith({
      type: "setCalendars",
      payload: [],
    });
    expect(unsubscribeSnapshot).toHaveBeenCalled();
  });

  it("should unsubscribe from auth and snapshot on unmount", () => {
    const unsubscribeAuth = jest.fn();
    const unsubscribeSnapshot = jest.fn();
    onSnapshotMock.mockReturnValue(unsubscribeSnapshot);
    collectionMock.mockReturnValue("col-ref");
    getFirestoreMock.mockReturnValue({});
    onAuthStateChangedMock.mockImplementation(() => {
      return unsubscribeAuth;
    });

    const { unmount } = renderHook(() => useCalendarsListener());
    unmount();

    expect(unsubscribeAuth).toHaveBeenCalled();
  });
});
