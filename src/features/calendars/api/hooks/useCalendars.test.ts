import { renderHook, act } from "@testing-library/react";
import { useCalendars } from "./useCalendars";

const getFirestoreMock = jest.fn();
const collectionMock = jest.fn();
const queryMock = jest.fn();
const whereMock = jest.fn();
const getDocsMock = jest.fn();
const addDocMock = jest.fn();
const onSnapshotMock = jest.fn();

jest.mock("firebase/firestore", () => ({
  getFirestore: () => getFirestoreMock(),
  collection: (...args: any[]) => collectionMock(...args),
  query: (...args: any[]) => queryMock(...args),
  where: (...args: any[]) => whereMock(...args),
  getDocs: (...args: any[]) => getDocsMock(...args),
  addDoc: (...args: any[]) => addDocMock(...args),
  onSnapshot: (...args: any[]) => onSnapshotMock(...args),
}));

describe("useCalendars", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty array and isLoading=false if uid is not provided", () => {
    const { result } = renderHook(() => useCalendars());
    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should subscribe on onSnapshot and update calendar list", () => {
    const fakeSnapshot = {
      docs: [
        {
          id: "calendar-1",
          data: () => ({
            title: "Test Calendar",
            color: "#123456",
            visible: true,
            uid: "user-1",
          }),
        },
      ],
    };

    onSnapshotMock.mockImplementation((_, onSuccess) => {
      onSuccess(fakeSnapshot);
      return jest.fn();
    });

    getFirestoreMock.mockReturnValue({});
    collectionMock.mockReturnValue("collection-ref");
    queryMock.mockReturnValue("query-ref");
    whereMock.mockReturnValue("where-ref");
    getDocsMock.mockResolvedValue({ empty: false });

    const { result } = renderHook(() => useCalendars("user-1"));
    expect(result.current.data).toEqual([
      {
        id: "calendar-1",
        title: "Test Calendar",
        color: "#123456",
        visible: true,
        uid: "user-1",
      },
    ]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(onSnapshotMock).toHaveBeenCalled();
  });

  it("should create default calendar if getDocs returns empty:true", async () => {
    getDocsMock.mockResolvedValue({ empty: true });
    addDocMock.mockResolvedValue({});
    onSnapshotMock.mockImplementation((_, onSuccess) => {
      onSuccess({ docs: [] });
      return jest.fn();
    });

    getFirestoreMock.mockReturnValue({});
    collectionMock.mockReturnValue("collection-ref");
    queryMock.mockReturnValue("query-ref");
    whereMock.mockReturnValue("where-ref");

    await act(async () => {
      renderHook(() => useCalendars("user-1"));
    });
    expect(addDocMock).toHaveBeenCalled();
  });

  it("should set error if onSnapshot calls error callback", () => {
    const error = new Error("Error calendar reading");
    onSnapshotMock.mockImplementation((_, _onSuccess, onError) => {
      onError(error);
      return jest.fn();
    });
    getFirestoreMock.mockReturnValue({});
    collectionMock.mockReturnValue("collection-ref");
    queryMock.mockReturnValue("query-ref");
    whereMock.mockReturnValue("where-ref");
    getDocsMock.mockResolvedValue({ empty: false });

    const { result } = renderHook(() => useCalendars("user-1"));
    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBe(false);
  });
});
