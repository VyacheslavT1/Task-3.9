import React from "react";
import CalendarForm from "features/calendars/ui/CalendarForm/CalendarForm";
import { useUpdateCalendar } from "features/calendars/api/hooks/useUpdateCalendar";
import { useAppSelector } from "app/appHooks";
import { useCalendars } from "features/calendars/api/hooks/useCalendars";

const UpdateCalendarForm: React.FC<{
  id: string;
  title: string;
  color: string;
  onClose: () => void;
}> = ({ id, title, color, onClose }) => {
  const { updateCalendar, isLoading } = useUpdateCalendar();
  const authUser = useAppSelector((state) => state.auth.user);
  const uid = authUser?.uid;
  const { data: calendars = [] } = useCalendars(uid);
  const usedColors = calendars.map((cal) => cal.color);

  return (
    <CalendarForm
      title={title}
      color={color}
      isLoading={isLoading}
      onSubmit={(title, color) => updateCalendar(id, { title, color })}
      onClose={onClose}
      usedColors={usedColors}
    />
  );
};
export default UpdateCalendarForm;
