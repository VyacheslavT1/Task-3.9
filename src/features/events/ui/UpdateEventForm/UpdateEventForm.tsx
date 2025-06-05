import React from "react";
import {
  EventForm,
  EventFormPayload,
  CalendarOption,
} from "../EventForm/EventForm";
import { useUpdateEvent } from "features/events/api/hooks/useUpdateEvent";
import { useCalendars } from "features/calendars/api/hooks/useCalendars";
import { useAppSelector } from "app/appHooks";
import { getRepeatOptions } from "../EventForm/repeatOptions";

interface UpdateEventFormProps {
  eventId: string;
  data: EventFormPayload;
  onClose: () => void;
}

export const UpdateEventForm: React.FC<UpdateEventFormProps> = ({
  eventId,
  data,
  onClose,
}) => {
  const { updateEvent, isLoading } = useUpdateEvent();
  const authUser = useAppSelector((state) => state.auth.user);
  const uid = authUser?.uid;
  const { data: calendars = [] } = useCalendars(uid);

  const calendarOptions: CalendarOption[] = calendars.map((cal) => ({
    value: cal.id,
    label: cal.title,
    color: cal.color,
  }));

  const repeatOptions = getRepeatOptions(data.date);

  const initialPayload: EventFormPayload = {
    title: data.title,
    date: data.date,
    startTime: data.startTime ?? "",
    endTime: data.endTime ?? "",
    calendarId: data.calendarId,
    repeat: data.repeat,
    allDay: data.allDay,
    description: data.description,
  };

  const handleUpdate = async (payload: EventFormPayload) => {
    await updateEvent(eventId, data.calendarId, payload);
    onClose();
  };

  return (
    <EventForm
      {...initialPayload}
      repeatOptions={repeatOptions}
      calendarOptions={calendarOptions}
      isLoading={isLoading}
      onSubmit={handleUpdate}
      onClose={onClose}
    />
  );
};
export default UpdateEventForm;
