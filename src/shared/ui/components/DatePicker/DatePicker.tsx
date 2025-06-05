import React, { useState } from "react";
import { useLazySVG } from "shared/hooks/useLazySVG";
import getDaysInMonth from "shared/utils/getDaysInMonth";
import styles from "./DatePicker.module.css";

const SHORT_WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export interface DatePickerProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(
    selectedDate instanceof Date ? selectedDate : new Date()
  );

  const NextIcon = useLazySVG("shared/icons/chevron-right.svg?react");
  const PrevIcon = useLazySVG("shared/icons/chevron-left.svg?react");

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelected(date);
    onDateSelect(date);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={styles.datePicker}>
      <div className={styles.header}>
        <span>
          {currentMonth.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        {PrevIcon && NextIcon && (
          <div className={styles.controls}>
            <button type="button" onClick={handlePrevMonth}>
              <PrevIcon />
            </button>
            <button type="button" onClick={handleNextMonth}>
              <NextIcon />
            </button>
          </div>
        )}
      </div>
      <div className={styles.calendar}>
        {SHORT_WEEK_DAYS.map((day, index) => (
          <div key={index} className={styles.dayLabel}>
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day.date.toISOString()}
            className={`${styles.day} ${day.disabled ? styles.disabled : ""}${
              selected?.toDateString() === day.date.toDateString()
                ? styles.selected
                : ""
            }`}
            onClick={() => !day.disabled && handleDateSelect(day.date)}
          >
            {day.date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};
export default DatePicker;
