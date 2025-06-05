import React, { useState } from "react";
import { useLazySVG } from "shared/hooks/useLazySVG";
import styles from "./ColorPicker.module.css";

export interface ColorPickerProps {
  colors: string[];
  disabledColors?: string[];
  onSelect: (color: string) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  disabledColors = [],
  onSelect,
  label,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const ColorIcon = useLazySVG("shared/icons/color.svg?react");
  const SelectedColorIcon = useLazySVG("shared/icons/color-selected.svg?react");

  const handleSelect = (color: string) => {
    setSelectedColor(color);
    onSelect(color);
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.label}>{label}</h3>
      <div className={styles.palette}>
        {colors.map((color) => {
          const Icon = selectedColor === color ? SelectedColorIcon : ColorIcon;
          const isDisabled = disabledColors.includes(color);

          if (!Icon) return null;
          return (
            Icon && (
              <span
                key={color}
                role="img"
                aria-label={`Color ${color}`}
                className={`${styles.icon} ${isDisabled ? styles.disabled : ""}`}
                onClick={(e) =>
                  isDisabled ? e.stopPropagation() : handleSelect(color)
                }
              >
                <Icon style={{ color }} />
              </span>
            )
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;
