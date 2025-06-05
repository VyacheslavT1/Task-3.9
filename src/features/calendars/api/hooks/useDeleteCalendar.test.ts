jest.mock("shared/api/firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
}));

import { renderHook, act } from "@testing-library/react";
import { useDeleteCalendar } from "./useDeleteCalendar";

const getFirestoreMock = jest.fn();
const collectionMock = jest.fn();
const writeBatchMock = jest.fn();
const batchInstance = {
  delete: jest.fn(),
  commit: jest.fn(),
};
const whereMock = jest.fn();
const queryMock = jest.fn();
const docMock = jest.fn();
const getDocsMock = jest.fn();

jest.mock("firebase/firestore", () => ({
  getFirestore: () => getFirestoreMock(),
  collection: (...args: any[]) => collectionMock(...args),
  writeBatch: (...args: any[]) => writeBatchMock(...args),
  where: (...args: any[]) => whereMock(...args),
  query: (...args: any[]) => queryMock(...args),
  doc: (...args: any[]) => docMock(...args),
  getDocs: (...args: any[]) => getDocsMock(...args),
}));

describe("useDeleteCalendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require("shared/api/firebase").auth.currentUser = { uid: "user-1" };
    writeBatchMock.mockReturnValue(batchInstance);
  });

  it("should delete calendar and all its events if more than one calendar", async () => {
    getDocsMock.mockResolvedValueOnce({ size: 2 }).mockResolvedValueOnce({
      docs: [{ ref: "event-ref-1" }, { ref: "event-ref-2" }],
    });
    batchInstance.delete.mockClear();
    batchInstance.commit.mockResolvedValue({});

    collectionMock.mockReturnValue("collection-ref");
    docMock.mockReturnValue("doc-ref");
    queryMock.mockReturnValue("query-ref");
    whereMock.mockReturnValue("where-ref");

    const { result } = renderHook(() => useDeleteCalendar());

    await act(async () => {
      await result.current.deleteCalendar("calendar-123");
    });

    expect(batchInstance.delete).toHaveBeenCalledWith("doc-ref");
    expect(batchInstance.delete).toHaveBeenCalledWith("event-ref-1");
    expect(batchInstance.delete).toHaveBeenCalledWith("event-ref-2");
    expect(batchInstance.commit).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should set error if only one calendar (cannot delete default)", async () => {
    getDocsMock.mockResolvedValueOnce({ size: 1 });
    const { result } = renderHook(() => useDeleteCalendar());

    await act(async () => {
      await result.current.deleteCalendar("calendar-123");
    });

    expect(result.current.error).toEqual(
      new Error("You can not delete default calendar")
    );
    expect(batchInstance.delete).not.toHaveBeenCalled();
    expect(batchInstance.commit).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("should set error if user is not authenticated", async () => {
    require("shared/api/firebase").auth.currentUser = null;
    const { result } = renderHook(() => useDeleteCalendar());

    await act(async () => {
      await result.current.deleteCalendar("calendar-999");
    });

    expect(result.current.error).toEqual(
      new Error("User is not authenticated")
    );
    expect(result.current.isLoading).toBe(false);
    expect(batchInstance.delete).not.toHaveBeenCalled();
    expect(batchInstance.commit).not.toHaveBeenCalled();
  });

  it("should set error if exception occurs in process", async () => {
    getDocsMock
      .mockResolvedValueOnce({ size: 2 })
      .mockRejectedValueOnce(new Error("Events DB error"));
    batchInstance.delete.mockClear();
    batchInstance.commit.mockClear();

    const { result } = renderHook(() => useDeleteCalendar());

    await act(async () => {
      await result.current.deleteCalendar("calendar-err");
    });

    expect(result.current.error).toEqual(new Error("Events DB error"));
    expect(result.current.isLoading).toBe(false);
    expect(batchInstance.commit).not.toHaveBeenCalled();
  });
});
