import React, { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";
interface Options {
  value: string;
  label: string;
  color?: string;
}

export interface DropdownProps {
  options: Options[];
  value: string;
  onSelect: (newValue: string) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant: "primary" | "secondary";
  label?: string;
  placeholder?: string;
  renderValue?: (option: Options | undefined) => React.ReactNode;
  renderOption?: (option: Options) => React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  variant,
  options,
  value,
  onSelect,
  icon,
  disabled = false,
  renderValue,
  renderOption,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div
      className={`${styles.wrapper} ${styles[variant]} ${disabled ? styles.disabled : ""} `}
      ref={wrapperRef}
    >
      <div
        className={`${styles.inputBox} ${isOpen ? styles.active : ""}`}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
      >
        {options.length === 0
          ? placeholder
          : renderValue
            ? renderValue(selectedOption)
            : selectedOption
              ? selectedOption.label
              : ""}
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>

      {isOpen && (
        <div className={styles.menu}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${
                value === option.value ? styles.selected : ""
              }`}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
            >
              {renderOption ? renderOption(option) : option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Dropdown;
