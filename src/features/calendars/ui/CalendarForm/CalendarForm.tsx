import React, { useState } from "react";
import { Button, InputField, ColorPicker } from "shared/ui/components";
import { InputType } from "shared/ui/components/InputField/InputField";
import { useLazySVG } from "shared/hooks/useLazySVG";
import styles from "./CalendarForm.module.css";
interface CalendarFormProps {
  title: string;
  color: string;
  usedColors: string[];
  isLoading: boolean;
  onSubmit: (title: string, color: string) => Promise<void>;
  onClose: () => void;
}

const CalendarForm: React.FC<CalendarFormProps> = ({
  title,
  color,
  usedColors,
  onSubmit,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState<string>(title);
  const [selectedColor, setSelectedColor] = useState<string>(color);
  const TitleIcon = useLazySVG("shared/icons/title.svg?react");
  const PaletteIcon = useLazySVG("shared/icons/palette.svg?react");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSave = async () => {
    await onSubmit(inputValue, selectedColor);
    onClose();
  };

  const isDisabled = inputValue.trim() === "" || selectedColor === "";
  const availableColors = [
    "#9f2957",
    "#d90056",
    "#e25d33",
    "#dfc45a",
    "#b8c42f",
    "#15af6e",
    "#429488",
    "#397e4a",
    "#439bdf",
    "#4154ae",
    "#6c7ac4",
    "#8333a4",
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      {TitleIcon && (
        <div className={styles.title}>
          <TitleIcon className={styles.titleIcon} />
          <InputField
            id="title"
            label="Title"
            type={InputType.Text}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter title"
          />
        </div>
      )}

      {PaletteIcon && (
        <div className={styles.colorPicker}>
          <PaletteIcon className={styles.paletteIcon} />
          <ColorPicker
            colors={availableColors}
            onSelect={setSelectedColor}
            label="Color"
            disabledColors={usedColors}
          />
        </div>
      )}
      <div className={styles.submitButton}>
        <Button variant="primary" type="submit" disabled={isDisabled}>
          Save
        </Button>
      </div>
    </form>
  );
};
export default CalendarForm;
