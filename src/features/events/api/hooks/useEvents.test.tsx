import { render, screen, waitFor } from "@testing-library/react";
import { useEvents, Event } from "./useEvents";

jest.mock("firebase/firestore", () => {
  class MockDoc {
    constructor(
      public id: string,
      private dataObj: any
    ) {}
    data() {
      return this.dataObj;
    }
  }

  return {
    getFirestore: () => ({}),
    collection: (_db: any, _col: string, calId: string, _subcol: string) => ({
      calendarId: calId,
    }),
    query: (_colRef: any, _where1: any, _where2: any) => ({
      calendarId: _colRef.calendarId,
    }),
    where: (_field: string, _op: any, _value: any) => ({}),

    onSnapshot: (
      q: any,
      next: (snap: { docs: MockDoc[] }) => void,
      _errorCallback: (err: any) => void
    ) => {
      const fakeDocData = {
        title: "Event from " + q.calendarId,
        date: "2025-05-31",
        calendarId: q.calendarId,
        startTime: "08:00",
        endTime: "09:00",
        repeat: "none",
        allDay: false,
        description: "",
        uid: "user-1",
        timestamp: 1,
      };
      const snap = {
        docs: [new MockDoc("evt-" + q.calendarId, fakeDocData)],
      };
      setTimeout(() => next(snap), 0);
      return () => {};
    },

    QuerySnapshot: class {},
    DocumentData: {},
  };
});

function TestComponent({
  weekStart,
  weekEnd,
  calendarIds,
}: {
  weekStart: Date;
  weekEnd: Date;
  calendarIds: string[];
}) {
  const { events, isLoading, error } = useEvents(
    weekStart,
    weekEnd,
    calendarIds
  );
  return (
    <div>
      <div data-testid="loading">{isLoading ? "true" : "false"}</div>
      <ul data-testid="events">
        {events.map((e: Event) => (
          <li key={e.id}>{e.title}</li>
        ))}
      </ul>
      <div data-testid="error">{error ? error.message : ""}</div>
    </div>
  );
}

describe("useEvents hook", () => {
  const weekStart = new Date("2025-06-01");
  const weekEnd = new Date("2025-06-07");

  it("should set isLoading=false and events empty when calendarIds is empty", async () => {
    render(
      <TestComponent weekStart={weekStart} weekEnd={weekEnd} calendarIds={[]} />
    );
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("events").childElementCount).toBe(0);
    });
  });

  it("should fetch events for single calendarId", async () => {
    render(
      <TestComponent
        weekStart={weekStart}
        weekEnd={weekEnd}
        calendarIds={["cal1"]}
      />
    );
    expect(screen.getByTestId("loading")).toHaveTextContent("true");
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByText("Event from cal1")).toBeInTheDocument();
    });
  });

  it("should fetch events for multiple calendarIds", async () => {
    render(
      <TestComponent
        weekStart={weekStart}
        weekEnd={weekEnd}
        calendarIds={["calA", "calB"]}
      />
    );
    expect(screen.getByTestId("loading")).toHaveTextContent("true");
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByText("Event from calA")).toBeInTheDocument();
      expect(screen.getByText("Event from calB")).toBeInTheDocument();
    });
  });
});
