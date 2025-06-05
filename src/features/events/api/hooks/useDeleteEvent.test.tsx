jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { useDeleteEvent } from "./useDeleteEvent";
import { getFirestore, deleteDoc, doc } from "firebase/firestore";

describe("useDeleteEvent", () => {
  const mockDb = {};
  const mockDocRef = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (getFirestore as jest.Mock).mockReturnValue(mockDb);
    (doc as jest.Mock).mockReturnValue(mockDocRef);
  });

  it("should delete an event and set isLoading correctly", async () => {
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteEvent());

    act(() => {
      result.current.deleteEvent("cal-1", "evt-123");
    });
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(getFirestore).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(
      mockDb,
      "calendars",
      "cal-1",
      "events",
      "evt-123"
    );
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
  });

  it("should set error when deleteDoc throws", async () => {
    const fakeError = new Error("Delete failed");
    (deleteDoc as jest.Mock).mockRejectedValue(fakeError);

    const { result } = renderHook(() => useDeleteEvent());

    act(() => {
      result.current.deleteEvent("cal-2", "evt-999");
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(fakeError);
    });

    expect(getFirestore).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(
      mockDb,
      "calendars",
      "cal-2",
      "events",
      "evt-999"
    );
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
  });
});
