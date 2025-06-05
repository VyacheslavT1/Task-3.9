import { renderHook, act } from "@testing-library/react";
import { useToggleCalendarVisibility } from "./useToggleCalendarVisibility";

const getFirestoreMock = jest.fn();
const docMock = jest.fn();
const updateDocMock = jest.fn();

jest.mock("firebase/firestore", () => ({
  getFirestore: () => getFirestoreMock(),
  doc: (...args: any[]) => docMock(...args),
  updateDoc: (...args: any[]) => updateDocMock(...args),
}));

describe("useToggleCalendarVisibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should toggle visibility and update Firestore", async () => {
    updateDocMock.mockResolvedValue({});
    docMock.mockReturnValue("doc-ref");
    getFirestoreMock.mockReturnValue("db-ref");

    const { result } = renderHook(() => useToggleCalendarVisibility());
    await act(async () => {
      await result.current.toggleVisibility("calendar-1", true);
    });

    expect(docMock).toHaveBeenCalledWith("db-ref", "calendars", "calendar-1");
    expect(updateDocMock).toHaveBeenCalledWith("doc-ref", { visible: false });
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should set error if updateDoc throws", async () => {
    const fakeError = new Error("Update error");
    updateDocMock.mockRejectedValue(fakeError);
    docMock.mockReturnValue("doc-ref");
    getFirestoreMock.mockReturnValue("db-ref");

    const { result } = renderHook(() => useToggleCalendarVisibility());

    await act(async () => {
      await result.current.toggleVisibility("calendar-2", false);
    });

    expect(result.current.error).toBe(fakeError);
    expect(result.current.isLoading).toBe(false);
  });
});
