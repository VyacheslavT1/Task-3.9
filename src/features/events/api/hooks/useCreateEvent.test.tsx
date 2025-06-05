jest.mock("shared/api/firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
}));

import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { useCreateEvent } from "./useCreateEvent";
import { auth } from "shared/api/firebase";

const getFirestoreMock = jest.fn();
const collectionMock = jest.fn();
const addDocMock = jest.fn();
const serverTimestampMock = jest.fn();

jest.mock("firebase/firestore", () => ({
  getFirestore: () => getFirestoreMock(),
  collection: (...args: any[]) => collectionMock(...args),
  addDoc: (...args: any[]) => addDocMock(...args),
  serverTimestamp: () => serverTimestampMock(),
}));

describe("useCreateEvent", () => {
  const mockDb = {};
  const mockCollectionRef = {};

  beforeEach(() => {
    jest.clearAllMocks();
    getFirestoreMock.mockReturnValue(mockDb);
    collectionMock.mockReturnValue(mockCollectionRef);
    serverTimestampMock.mockReturnValue({ mocked: "ts" });
  });

  it("should set error if user is not authenticated", async () => {
    (auth as any).currentUser = null;

    const { result } = renderHook(() => useCreateEvent());

    act(() => {
      result.current.createEvent({
        title: "Test Event",
        date: new Date("2025-06-10"),
        calendarId: "cal-1",
        repeat: "none",
        allDay: false,
        description: "Description",
      });
    });

    await waitFor(() => {
      expect(result.current.error).toEqual(
        new Error("User is not authenticated")
      );
    });

    expect(result.current.isLoading).toBe(false);
    expect(addDocMock).not.toHaveBeenCalled();
  });

  it("should call addDoc with correct arguments when user is authenticated", async () => {
    (auth as any).currentUser = { uid: "user-123" };
    addDocMock.mockResolvedValue({ id: "event-1" });

    const payload = {
      title: "Team Meeting",
      date: new Date("2025-06-15"),
      calendarId: "cal-42",
      repeat: "none",
      allDay: false,
      description: "Monthly sync",
    };

    const { result } = renderHook(() => useCreateEvent());

    act(() => {
      result.current.createEvent(payload);
    });

    await waitFor(() => {
      expect(getFirestoreMock).toHaveBeenCalled();
      expect(collectionMock).toHaveBeenCalledWith(
        mockDb,
        "calendars",
        payload.calendarId,
        "events"
      );
      expect(addDocMock).toHaveBeenCalledWith(mockCollectionRef, {
        ...payload,
        uid: "user-123",
        createdAt: { mocked: "ts" },
      });
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should set error when addDoc throws", async () => {
    (auth as any).currentUser = { uid: "user-999" };
    const fakeError = new Error("Firestore failure");
    addDocMock.mockRejectedValue(fakeError);

    const payload = {
      title: "Title",
      date: new Date("2025-07-01"),
      calendarId: "cal-7",
      repeat: "none",
      allDay: false,
      description: "Description",
    };

    const { result } = renderHook(() => useCreateEvent());

    act(() => {
      result.current.createEvent(payload);
    });

    await waitFor(() => {
      expect(addDocMock).toHaveBeenCalled();
      expect(result.current.error).toBe(fakeError);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
