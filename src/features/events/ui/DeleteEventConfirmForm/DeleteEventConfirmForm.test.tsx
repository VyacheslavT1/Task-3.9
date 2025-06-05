import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteEventConfirmForm from "./DeleteEventConfirmForm";

jest.mock("shared/ui/components", () => ({
  ...jest.requireActual("shared/ui/components"),
  DeleteConfirmForm: ({ isLoading, onCancel, onConfirm, children }: any) => (
    <div data-testid="delete-confirm-form">
      <span data-testid="loading">{String(isLoading)}</span>
      <button data-testid="confirm-btn" onClick={onConfirm}>
        Confirm
      </button>
      <button data-testid="cancel-btn" onClick={onCancel}>
        Cancel
      </button>
      <div>{children}</div>
    </div>
  ),
}));

const deleteEventMock = jest.fn();
jest.mock("features/events/api/hooks/useDeleteEvent", () => ({
  useDeleteEvent: () => ({
    deleteEvent: deleteEventMock,
    isLoading: false,
  }),
}));

const closeModalMock = jest.fn();
const showToastMock = jest.fn();
jest.mock("shared/ui/context/ModalContext", () => ({
  useModal: () => ({
    closeModal: closeModalMock,
    showToast: showToastMock,
  }),
}));

describe("DeleteEventConfirmForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render DeleteConfirmForm with correct text", () => {
    render(
      <DeleteEventConfirmForm
        calendarId="cal-1"
        id="event-1"
        title="Test Event"
        onClose={jest.fn()}
      />
    );

    expect(
      screen.getByText(/Are you sure you want to delete event/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Test Event/)).toBeInTheDocument();
  });

  it("should call onClose when Cancel is clicked", () => {
    const onCloseMock = jest.fn();
    render(
      <DeleteEventConfirmForm
        calendarId="cal-1"
        id="event-2"
        title="Test Cancel"
        onClose={onCloseMock}
      />
    );
    fireEvent.click(screen.getByTestId("cancel-btn"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("should call deleteEvent, closeModal, and showToast on Confirm", async () => {
    deleteEventMock.mockResolvedValue(undefined);
    render(
      <DeleteEventConfirmForm
        calendarId="cal-2"
        id="event-3"
        title="Meetings"
        onClose={jest.fn()}
      />
    );
    fireEvent.click(screen.getByTestId("confirm-btn"));
    await waitFor(() => {
      expect(deleteEventMock).toHaveBeenCalledWith("cal-2", "event-3");
      expect(closeModalMock).toHaveBeenCalled();
      expect(showToastMock).toHaveBeenCalledWith("Event Meetings deleted");
    });
  });
});

describe("DeleteEventConfirmForm (isLoading = true)", () => {
  beforeAll(() => {
    jest.resetModules();
    jest.doMock("features/events/api/hooks/useDeleteEvent", () => ({
      useDeleteEvent: () => ({
        deleteEvent: jest.fn(),
        isLoading: true,
      }),
    }));
    jest.doMock("shared/ui/components", () => ({
      ...jest.requireActual("shared/ui/components"),
      DeleteConfirmForm: ({ isLoading }: any) => (
        <div data-testid="loading">{String(isLoading)}</div>
      ),
    }));
    jest.doMock("shared/ui/context/ModalContext", () => ({
      useModal: () => ({
        closeModal: jest.fn(),
        showToast: jest.fn(),
      }),
    }));
  });

  afterAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should pass isLoading prop to DeleteConfirmForm", async () => {
    const { default: DeleteEventConfirmForm } = await import(
      "./DeleteEventConfirmForm"
    );
    render(
      <DeleteEventConfirmForm
        calendarId="cal-3"
        id="event-4"
        title="Loading Event"
        onClose={jest.fn()}
      />
    );
    expect(await screen.findByTestId("loading")).toHaveTextContent("true");
  });
});
