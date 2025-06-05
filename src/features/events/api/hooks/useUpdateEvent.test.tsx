import { renderHook, act } from "@testing-library/react";
import { useUpdateEvent } from "./useUpdateEvent";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn((db, path1, path2, path3, path4) => ({
    db,
    path1,
    path2,
    path3,
    path4,
  })),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  Timestamp: {
    fromDate: jest.fn((date) => date),
  },
}));

describe("useUpdateEvent", () => {
  const mockEventId = "event123";
  const mockOriginalCalendarId = "calendar1";
  const mockEventData = {
    title: "Updated Event",
    date: new Date("2025-06-01"),
    repeat: "none",
    allDay: true,
    description: "Updated description",
    calendarId: "calendar2",
    startTime: "10:00",
    endTime: "11:00",
  };

  const mockSourceData = {
    title: "Original Event",
    date: new Date("2025-05-31"),
    repeat: "weekly",
    allDay: false,
    description: "Original description",
    calendarId: "calendar1",
    startTime: "09:00",
    endTime: "10:00",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockSourceData,
    });
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);
    (Timestamp.fromDate as jest.Mock).mockImplementation((date) => date);
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useUpdateEvent());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should update event in the same calendar", async () => {
    const { result } = renderHook(() => useUpdateEvent());

    await act(async () => {
      await result.current.updateEvent(mockEventId, mockOriginalCalendarId, {
        ...mockEventData,
        calendarId: mockOriginalCalendarId,
      });
    });

    expect(getFirestore).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledTimes(2);
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("should move event to a different calendar", async () => {
    const { result } = renderHook(() => useUpdateEvent());

    await act(async () => {
      await result.current.updateEvent(
        mockEventId,
        mockOriginalCalendarId,
        mockEventData
      );
    });

    expect(getFirestore).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledTimes(2);
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
  });

  it("should update event data correctly", async () => {
    const { result } = renderHook(() => useUpdateEvent());

    await act(async () => {
      await result.current.updateEvent(
        mockEventId,
        mockOriginalCalendarId,
        mockEventData
      );
    });

    expect(setDoc).toHaveBeenCalledWith(
      expect.objectContaining({
        path1: "calendars",
        path2: mockEventData.calendarId,
        path3: "events",
        path4: mockEventId,
      }),
      {
        ...mockSourceData,
        title: mockEventData.title,
        date: mockEventData.date,
        repeat: mockEventData.repeat,
        allDay: mockEventData.allDay,
        description: mockEventData.description,
        calendarId: mockEventData.calendarId,
        startTime: mockEventData.startTime,
        endTime: mockEventData.endTime,
      }
    );
  });
});
