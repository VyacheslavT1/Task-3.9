import React, { useEffect } from "react";
import { Dropdown } from "shared/ui/components";
import { useLazySVG } from "shared/hooks/useLazySVG";
import type { CalendarOption } from "../EventForm/EventForm";
import styles from "./CalendarSelector.module.css";

interface CalendarSelectorProps {
  calendarOptions: CalendarOption[];
  selectedCalendar: string;
  setSelectedCalendar: (value: string) => void;
}

const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  calendarOptions,
  selectedCalendar,
  setSelectedCalendar,
}) => {
  const CalendarIcon = useLazySVG("shared/icons/calendar.svg?react");
  const ChevronDownIcon = useLazySVG("shared/icons/chevron-down.svg?react");
  const ColorIndicatorIcon = useLazySVG("shared/icons/color.svg?react");

  useEffect(() => {
    if (!selectedCalendar && calendarOptions.length > 0) {
      setSelectedCalendar(calendarOptions[0].value);
    }
  }, [calendarOptions, selectedCalendar, setSelectedCalendar]);

  return (
    <>
      {CalendarIcon && (
        <div className={styles.row}>
          <CalendarIcon className={styles.icon} />
          <div className={styles.calendar}>
            <Dropdown
              variant="secondary"
              options={calendarOptions}
              value={selectedCalendar}
              onSelect={setSelectedCalendar}
              icon={ChevronDownIcon && <ChevronDownIcon />}
              disabled={calendarOptions.length === 0}
              label="Calendar"
              placeholder="Choose your calendar"
              renderValue={(option) =>
                option && ColorIndicatorIcon ? (
                  <>
                    <ColorIndicatorIcon style={{ color: option.color }} />
                    {option.label}
                  </>
                ) : null
              }
              renderOption={(option) =>
                ColorIndicatorIcon ? (
                  <>
                    <ColorIndicatorIcon style={{ color: option.color }} />
                    {option.label}
                  </>
                ) : (
                  option.label
                )
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarSelector;
