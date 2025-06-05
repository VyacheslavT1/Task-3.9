import React, { useState, useRef, useEffect } from "react";
import { InputType } from "shared/ui/components/InputField/InputField";
import { InputField, DatePicker, SelectMenu } from "shared/ui/components";
import { useLazySVG } from "shared/hooks/useLazySVG";
import styles from "./DateTimeSelector.module.scss";

interface DateTimeSelectorProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  timeStart: string;
  setTimeStart: (time: string) => void;
  timeEnd: string;
  setTimeEnd: (time: string) => void;
  isAllDay: boolean;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  setSelectedDate,
  timeStart,
  setTimeStart,
  timeEnd,
  setTimeEnd,
  isAllDay,
}) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const containerElementRef = useRef<HTMLDivElement>(null);
  const ClockIcon = useLazySVG("shared/icons/clock.svg?react");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isDatePickerVisible &&
        containerElementRef.current &&
        !containerElementRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDatePickerVisible]);

  useEffect(() => {
    if (selectedDate) {
      setIsDatePickerVisible(false);
    }
  }, [selectedDate]);

  const formattedDateString = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className={styles.row}>
      {ClockIcon && <ClockIcon className={styles.icon} />}
      <div className={styles.dateTimeSelector}>
        <div
          className={styles.dateSelector}
          onClick={() => setIsDatePickerVisible(true)}
          ref={containerElementRef}
        >
          <InputField
            id="date"
            label="Date"
            type={InputType.Text}
            value={formattedDateString}
            onChange={() => {}}
            placeholder="Select date"
          />
          {isDatePickerVisible && (
            <div className={styles.datePicker}>
              <DatePicker
                onDateSelect={(chosenDate) => {
                  setSelectedDate(chosenDate);
                  setIsDatePickerVisible(false);
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.timeSelector}>
          <SelectMenu
            label="Time"
            selectedTime={timeStart}
            onTimeSelect={setTimeStart}
            includeBlank
            disabled={isAllDay}
          />
          —
          <SelectMenu
            label="Time"
            selectedTime={timeEnd}
            onTimeSelect={setTimeEnd}
            minTime={timeStart}
            includeBlank
            disabled={isAllDay}
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelector;
