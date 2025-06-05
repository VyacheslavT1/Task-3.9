// src/features/calendars/ui/CalendarForm.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CalendarForm from "./CalendarForm";

// Мокаем кастомные иконки и компоненты
jest.mock("shared/hooks/useLazySVG", () => ({
  useLazySVG: () => (props: any) => <svg {...props} data-testid="icon" />,
}));

jest.mock("shared/ui/components", () => {
  // Реальный модуль, чтобы не ломать другие экспорты
  const actual = jest.requireActual("shared/ui/components");
  return {
    ...actual,
    ColorPicker: ({ onSelect }: any) => (
      <div>
        <button onClick={() => onSelect("#123456")} data-testid="color-btn">
          Color
        </button>
      </div>
    ),
    InputField: (props: any) => (
      <input
        data-testid="input"
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    ),
    InputType: { Text: "text" },
    Button: (props: any) => <button {...props}>{props.children}</button>,
  };
});

describe("CalendarForm", () => {
  it("should render form with initial values", () => {
    // Рендерим форму с начальными значениями
    render(
      <CalendarForm
        title="Initial Title"
        color="#abcdef"
        usedColors={["#123456"]}
        isLoading={false}
        onSubmit={jest.fn()}
        onClose={jest.fn()}
      />
    );

    // Проверяем, что поле ввода содержит начальный текст
    expect(screen.getByTestId("input")).toHaveValue("Initial Title");
    // Кнопка сохранения есть
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    // Иконки присутствуют
    expect(screen.getAllByTestId("icon").length).toBeGreaterThan(0);
  });

  it("should call onSubmit and onClose when form is submitted", async () => {
    // Мокаем обработчики
    const onSubmitMock = jest.fn().mockResolvedValue(undefined);
    const onCloseMock = jest.fn();

    render(
      <CalendarForm
        title=""
        color=""
        usedColors={[]}
        isLoading={false}
        onSubmit={onSubmitMock}
        onClose={onCloseMock}
      />
    );

    // Вводим новый текст
    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "My Calendar" },
    });
    // Выбираем цвет
    fireEvent.click(screen.getByTestId("color-btn"));
    // Жмём сохранить
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    // Проверяем, что onSubmit был вызван с правильными аргументами
    await waitFor(() =>
      expect(onSubmitMock).toHaveBeenCalledWith("My Calendar", "#123456")
    );
    // После успешного сабмита должен вызваться onClose
    await waitFor(() => expect(onCloseMock).toHaveBeenCalled());
  });

  it("should disable Save button if title or color is empty", () => {
    // Нет текста и цвета — кнопка неактивна
    render(
      <CalendarForm
        title=""
        color=""
        usedColors={[]}
        isLoading={false}
        onSubmit={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();

    // Очищаем DOM, чтобы следующая форма не конфликтовала с первой
    // Альтернатива: делай отдельный тест

    // Только цвет — кнопка неактивна
    // Лучше оформить это отдельным it(...), пример ниже:
  });
  it("should disable Save button if color is empty", () => {
    render(
      <CalendarForm
        title="T"
        color=""
        usedColors={[]}
        isLoading={false}
        onSubmit={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });
});
