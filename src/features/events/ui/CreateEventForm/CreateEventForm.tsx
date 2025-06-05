import React from "react";
import {
  EventForm,
  EventFormPayload,
  CalendarOption,
} from "../EventForm/EventForm";
import { useCreateEvent } from "features/events/api/hooks/useCreateEvent";
import { useCalendars } from "features/calendars/api/hooks/useCalendars";
import { useAppSelector } from "app/appHooks";
import { getRepeatOptions } from "../EventForm/repeatOptions";

export interface CreateEventFormProps {
  onClose: () => void;
  initialValues?: Partial<EventFormPayload>;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  onClose,
  initialValues = {},
}) => {
  const { createEvent, isLoading } = useCreateEvent();
  const authUser = useAppSelector((state) => state.auth.user);
  const uid = authUser?.uid;
  const { data: calendars = [] } = useCalendars(uid);

  const calendarOptions: CalendarOption[] = calendars.map((cal) => ({
    value: cal.id,
    label: cal.title,
    color: cal.color,
  }));

  const repeatOptions = getRepeatOptions(null);
  const defaultPayload: EventFormPayload = {
    title: "",
    date: null,
    startTime: "",
    endTime: "",
    calendarId: "",
    repeat: repeatOptions[0].value,
    allDay: false,
    description: "",
  };

  const formProps: EventFormPayload = {
    ...defaultPayload,
    ...initialValues,
  };

  return (
    <EventForm
      {...formProps}
      calendarOptions={calendarOptions}
      repeatOptions={repeatOptions}
      isLoading={isLoading}
      onSubmit={(payload) => createEvent(payload)}
      onClose={onClose}
    />
  );
};
export default CreateEventForm;
