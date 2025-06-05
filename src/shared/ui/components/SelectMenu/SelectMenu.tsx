import React, { useState, useEffect, useRef } from "react";
import styles from "./SelectMenu.module.css";
import useTimeOptions from "shared/hooks/useTimeOptions";
import { parseTimeToMinutes } from "shared/utils/parseTimeToMinutes";

export interface SelectMenuProps {
  label: string;
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  minTime?: string;
  includeBlank?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const SelectMenu: React.FC<SelectMenuProps> = ({
  label,
  selectedTime = "",
  onTimeSelect,
  minTime,
  includeBlank = false,
  disabled = false,
  placeholder = "Select time",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const rawTimeOptions = useTimeOptions();
  const timeOptions = includeBlank ? ["", ...rawTimeOptions] : rawTimeOptions;
  const [selected, setSelected] = useState<string>(selectedTime);
  const minMinutes = minTime != null ? parseTimeToMinutes(minTime) : undefined;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <h3 className={styles.label} aria-label={label}>
        {label}
      </h3>

      <div
        className={`${styles.inputBox} ${disabled ? styles.disabled : ""}`}
        onClick={() => {
          if (disabled) return;
          setIsOpen((open) => !open);
        }}
      >
        {selected || <span className={styles.placeholder}>{placeholder}</span>}
      </div>

      {isOpen && (
        <div className={styles.menu} ref={listRef}>
          {timeOptions.map((time) => {
            const minutes = time ? parseTimeToMinutes(time) : undefined;
            const disabled =
              minutes !== undefined &&
              minMinutes !== undefined &&
              minutes <= minMinutes;

            return (
              <div
                key={time === "" ? "__blank__" : time}
                className={`${styles.option} ${
                  disabled ? styles.disabled : ""
                }`}
                onClick={() => {
                  if (disabled) return;
                  setSelected(time);
                  onTimeSelect(time);
                  setIsOpen(false);
                }}
              >
                {time}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectMenu;
