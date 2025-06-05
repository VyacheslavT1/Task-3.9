import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteCalendarConfirmForm from "./DeleteCalendarConfirmForm";

jest.mock("shared/ui/components", () => ({
  ...jest.requireActual("shared/ui/components"),
  DeleteConfirmForm: ({ isLoading, onCancel, onConfirm, children }: any) => (
    <div>
      <div data-testid="delete-confirm-form">
        <span data-testid="loading">{String(isLoading)}</span>
        <button data-testid="confirm-btn" onClick={onConfirm}>
          Confirm
        </button>
        <button data-testid="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <div data-testid="form-children">{children}</div>
      </div>
    </div>
  ),
}));

const deleteCalendarMock = jest.fn();
jest.mock("features/calendars/api/hooks/useDeleteCalendar", () => ({
  useDeleteCalendar: () => ({
    deleteCalendar: deleteCalendarMock,
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

describe("DeleteCalendarConfirmForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render DeleteConfirmForm with correct children", () => {
    render(
      <DeleteCalendarConfirmForm id="cal-1" title="Work" onClose={jest.fn()} />
    );

    expect(screen.getByTestId("delete-confirm-form")).toBeInTheDocument();
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByText(/calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Work/)).toBeInTheDocument();
  });

  it("should call onClose when Cancel is clicked", () => {
    const onCloseMock = jest.fn();
    render(
      <DeleteCalendarConfirmForm
        id="cal-1"
        title="Personal"
        onClose={onCloseMock}
      />
    );
    fireEvent.click(screen.getByTestId("cancel-btn"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("should call deleteCalendar, closeModal, and showToast on Confirm", async () => {
    deleteCalendarMock.mockResolvedValue(undefined);
    render(
      <DeleteCalendarConfirmForm
        id="cal-2"
        title="Meetings"
        onClose={jest.fn()}
      />
    );

    fireEvent.click(screen.getByTestId("confirm-btn"));
    await waitFor(() => {
      expect(deleteCalendarMock).toHaveBeenCalledWith("cal-2");
      expect(closeModalMock).toHaveBeenCalled();
      expect(showToastMock).toHaveBeenCalledWith("Calendar Meetings deleted");
    });
  });
});
describe("DeleteCalendarConfirmForm isLoading=true", () => {
  beforeAll(() => {
    jest.resetModules();
    jest.doMock("features/calendars/api/hooks/useDeleteCalendar", () => ({
      useDeleteCalendar: () => ({
        deleteCalendar: jest.fn(),
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
    const { default: DeleteCalendarConfirmForm } = await import(
      "./DeleteCalendarConfirmForm"
    );
    const { findByTestId } = render(
      <DeleteCalendarConfirmForm id="cal-3" title="Other" onClose={jest.fn()} />
    );
    expect(await findByTestId("loading")).toHaveTextContent("true");
  });
});
