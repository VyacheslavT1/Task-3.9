jest.mock("shared/api/firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
}));

import { renderHook, act } from "@testing-library/react";
import { useCreateCalendar } from "./useCreateCalendar";

const getFirestoreMock = jest.fn();
const collectionMock = jest.fn();
const addDocMock = jest.fn();

jest.mock("firebase/firestore", () => ({
  getFirestore: () => getFirestoreMock(),
  collection: (...args: any[]) => collectionMock(...args),
  addDoc: (...args: any[]) => addDocMock(...args),
}));

describe("useCreateCalendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require("shared/api/firebase").auth.currentUser = { uid: "user-1" };
  });

  it("should create calendar with correct data", async () => {
    addDocMock.mockResolvedValue({});
    collectionMock.mockReturnValue("collection-ref");
    getFirestoreMock.mockReturnValue("db-ref");

    const { result } = renderHook(() => useCreateCalendar());

    await act(async () => {
      await result.current.createCalendar({
        title: "Test Calendar",
        color: "#123456",
      });
    });

    expect(addDocMock).toHaveBeenCalledWith("collection-ref", {
      title: "Test Calendar",
      color: "#123456",
      visible: true,
      uid: "user-1",
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should set error if user is not authenticated", async () => {
    require("shared/api/firebase").auth.currentUser = null;
    const { result } = renderHook(() => useCreateCalendar());

    await act(async () => {
      await result.current.createCalendar({
        title: "No User",
        color: "#ffffff",
      });
    });

    expect(result.current.error).toEqual(
      new Error("User is not authenticated")
    );
    expect(addDocMock).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("should set error if addDoc throws", async () => {
    const fakeError = new Error("DB error");
    addDocMock.mockRejectedValue(fakeError);
    collectionMock.mockReturnValue("collection-ref");
    getFirestoreMock.mockReturnValue("db-ref");

    const { result } = renderHook(() => useCreateCalendar());

    await act(async () => {
      await result.current.createCalendar({
        title: "Crash Calendar",
        color: "#888888",
      });
    });

    expect(result.current.error).toBe(fakeError);
    expect(result.current.isLoading).toBe(false);
  });
});
