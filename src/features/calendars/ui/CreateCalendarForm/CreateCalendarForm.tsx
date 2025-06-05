import React from "react";
import CalendarForm from "features/calendars/ui/CalendarForm/CalendarForm";
import { useCreateCalendar } from "features/calendars/api/hooks/useCreateCalendar";
import { useAppSelector } from "app/appHooks";
import { useCalendars } from "features/calendars/api/hooks/useCalendars";

const CreateCalendarForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const authUser = useAppSelector((state) => state.auth.user);
  const uid = authUser?.uid;
  const { createCalendar, isLoading } = useCreateCalendar();
  const { data: calendars = [] } = useCalendars(uid);
  const usedColors = calendars.map((cal) => cal.color);

  return (
    <CalendarForm
      title=""
      color=""
      usedColors={usedColors}
      isLoading={isLoading}
      onSubmit={(title, color) => createCalendar({ title, color })}
      onClose={onClose}
    />
  );
};
export default CreateCalendarForm;
