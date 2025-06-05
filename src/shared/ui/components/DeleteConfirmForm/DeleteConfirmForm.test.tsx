import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteConfirmForm from "./DeleteConfirmForm";

jest.mock("shared/ui/components/Button/Button", () => ({
  __esModule: true,
  default: (props: any) => (
    <button
      data-testid={props.type === "submit" ? "delete-button" : "cancel-button"}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  ),
}));

describe("DeleteConfirmForm", () => {
  it("should render children", () => {
    render(
      <DeleteConfirmForm onConfirm={jest.fn()} onCancel={jest.fn()}>
        <div data-testid="content">Are you sure?</div>
      </DeleteConfirmForm>
    );
    expect(screen.getByTestId("content")).toHaveTextContent("Are you sure?");
  });

  it("should call onCancel when cancel button is clicked", () => {
    const onCancelMock = jest.fn();
    render(
      <DeleteConfirmForm onConfirm={jest.fn()} onCancel={onCancelMock}>
        <div>Test</div>
      </DeleteConfirmForm>
    );
    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(onCancelMock).toHaveBeenCalled();
  });

  it("should call onConfirm when form is submitted", async () => {
    const onConfirmMock = jest.fn().mockResolvedValue(undefined);
    render(
      <DeleteConfirmForm onConfirm={onConfirmMock} onCancel={jest.fn()}>
        <div>Test</div>
      </DeleteConfirmForm>
    );
    fireEvent.click(screen.getByTestId("delete-button"));
    await waitFor(() => {
      expect(onConfirmMock).toHaveBeenCalled();
    });
  });

  it("should disable delete button if isLoading is true", () => {
    render(
      <DeleteConfirmForm
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        isLoading={true}
      >
        <div>Test</div>
      </DeleteConfirmForm>
    );
    expect(screen.getByTestId("delete-button")).toBeDisabled();
  });
});
