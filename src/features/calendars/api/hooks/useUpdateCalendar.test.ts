import { renderHook, act } from "@testing-library/react";
import { useUpdateCalendar } from "./useUpdateCalendar";

const getFirestoreMock = jest.fn();
const docMock = jest.fn();
const updateDocMock = jest.fn();

jest.mock("firebase/firestore", () => ({
  getFirestore: () => getFirestoreMock(),
  doc: (...args: any[]) => docMock(...args),
  updateDoc: (...args: any[]) => updateDocMock(...args),
}));

describe("useUpdateCalendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update calendar data in Firestore", async () => {
    updateDocMock.mockResolvedValue({});
    docMock.mockReturnValue("doc-ref");
    getFirestoreMock.mockReturnValue("db-ref");

    const { result } = renderHook(() => useUpdateCalendar());

    await act(async () => {
      await result.current.updateCalendar("calendar-1", {
        title: "New Title",
        color: "#ffffff",
      });
    });

    expect(docMock).toHaveBeenCalledWith("db-ref", "calendars", "calendar-1");
    expect(updateDocMock).toHaveBeenCalledWith("doc-ref", {
      title: "New Title",
      color: "#ffffff",
    });
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should set error if updateDoc throws", async () => {
    const fakeError = new Error("Update error");
    updateDocMock.mockRejectedValue(fakeError);
    docMock.mockReturnValue("doc-ref");
    getFirestoreMock.mockReturnValue("db-ref");

    const { result } = renderHook(() => useUpdateCalendar());

    await act(async () => {
      await result.current.updateCalendar("calendar-2", {
        title: "Crash Title",
      });
    });
    expect(result.current.error).toBe(fakeError);
    expect(result.current.isLoading).toBe(false);
  });
});
