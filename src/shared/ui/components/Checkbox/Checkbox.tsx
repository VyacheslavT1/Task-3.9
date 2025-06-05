import React, { useState } from "react";
import { useLazySVG } from "shared/hooks/useLazySVG";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "labeled";
  label?: string;
  color?: string;
  onCheck: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  variant = "default",
  label,
  onCheck,
  checked = false,
  color,
  ...props
}) => {
  const CheckboxIcon = useLazySVG("shared/icons/checkbox-line.svg?react");
  const CheckboxCheckedIcon = useLazySVG(
    "shared/icons/checkbox-fill.svg?react"
  );
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleCheck = () => {
    const next = !isChecked;
    setIsChecked(next);
    onCheck(next);
  };

  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheck}
        className={styles.input}
        role="checkbox"
        aria-checked={isChecked}
        {...props}
      />
      {CheckboxIcon && CheckboxCheckedIcon && (
        <span
          role="img"
          aria-label="Checkbox icon"
          onClick={handleCheck}
          style={{ color }}
        >
          {isChecked ? <CheckboxCheckedIcon /> : <CheckboxIcon />}
        </span>
      )}
      {variant === "labeled" && label && <p>{label}</p>}
    </label>
  );
};

export default Checkbox;
