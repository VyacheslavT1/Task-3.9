import React, { useState } from "react";
import { InputType } from "shared/ui/components/InputField/InputField";
import {
  InputField,
  Checkbox,
  Dropdown,
  TextArea,
  Button,
} from "shared/ui/components";
import { useLazySVG } from "shared/hooks/useLazySVG";
import { RepeatOption, getRepeatOptions } from "./repeatOptions";
import DateTimeSelector from "features/events/ui/DateTimeSelector/DateTimeSelector";
import CalendarSelector from "features/events/ui/CalendarSelector/CalendarSelector";
import styles from "./EventForm.module.css";

export interface EventFormPayload {
  title: string;
  date: Date | null;
  startTime?: string;
  endTime?: string;
  calendarId: string;
  repeat: string;
  allDay: boolean;
  description: string;
}

export interface CalendarOption {
  value: string;
  label: string;
  color: string;
}

export interface EventFormProps {
  title: string;
  date: Date | null;
  startTime?: string;
  endTime?: string;
  calendarId: string;
  repeat: string;
  repeatOptions: RepeatOption[];
  allDay: boolean;
  description: string;
  calendarOptions: CalendarOption[];
  isLoading: boolean;
  onSubmit: (payload: EventFormPayload) => Promise<void>;
  onClose: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  title,
  date,
  startTime = "",
  endTime = "",
  calendarId,
  repeat,
  allDay,
  description,
  calendarOptions,
  isLoading,
  onSubmit,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState(title);
  const [selectedDate, setSelectedDate] = useState<Date | null>(date);
  const [timeStart, setTimeStart] = useState<string>(startTime);
  const [timeEnd, setTimeEnd] = useState<string>(endTime);
  const [isAllDay, setIsAllDay] = useState(allDay);
  const [repeatMode, setRepeatMode] = useState(repeat);
  const [selectedCalendar, setSelectedCalendar] = useState(calendarId);
  const [textValue, setTextValue] = useState(description);
  const TitleIcon = useLazySVG("shared/icons/title.svg?react");
  const DescriptionIcon = useLazySVG("shared/icons/description.svg?react");
  const ChevronDownIcon = useLazySVG("shared/icons/chevron-down.svg?react");

  const repeatOptions = getRepeatOptions(selectedDate);

  const isSaveDisabled =
    inputValue.trim() === "" ||
    selectedDate === null ||
    selectedCalendar === "";

  const handleSave = async () => {
    const payload: EventFormPayload = {
      title: inputValue,
      date: selectedDate,
      ...(isAllDay
        ? { startTime: "", endTime: "" }
        : { startTime: timeStart, endTime: timeEnd }),
      calendarId: selectedCalendar,
      repeat: repeatMode,
      allDay: isAllDay,
      description: textValue,
    };

    await onSubmit(payload);
    onClose();
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      {TitleIcon && (
        <div className={styles.row}>
          <TitleIcon className={styles.icon} />
          <InputField
            id="title"
            label="Title"
            type={InputType.Text}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter title"
          />
        </div>
      )}

      <DateTimeSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        timeStart={timeStart}
        setTimeStart={setTimeStart}
        timeEnd={timeEnd}
        setTimeEnd={setTimeEnd}
        isAllDay={isAllDay}
      />

      <div className={styles.row}>
        <div className={styles.repeat}>
          <div className={styles.checkbox}>
            <Checkbox
              variant="labeled"
              label="All day"
              checked={isAllDay}
              onCheck={setIsAllDay}
              color="#00AE1C"
            />
          </div>
          <div className={styles.select}>
            <Dropdown
              variant="secondary"
              options={repeatOptions}
              value={repeatMode}
              onSelect={setRepeatMode}
              icon={ChevronDownIcon && <ChevronDownIcon />}
              disabled={!selectedDate}
            />
          </div>
        </div>
      </div>

      <CalendarSelector
        calendarOptions={calendarOptions}
        selectedCalendar={selectedCalendar}
        setSelectedCalendar={setSelectedCalendar}
      />

      {DescriptionIcon && (
        <div className={styles.row}>
          <DescriptionIcon className={styles.icon} />
          <div className={styles.description}>
            <TextArea
              title="Description"
              value={textValue}
              placeholder="Enter description"
              rows={1}
              autoResize
              onChange={(e) => setTextValue(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className={`${styles.row} ${styles.submitButton}`}>
        <Button
          variant="primary"
          type="submit"
          disabled={isSaveDisabled || isLoading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};
export default EventForm;
