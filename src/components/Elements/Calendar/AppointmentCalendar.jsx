import { Calendar } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import styled from "styled-components";
import { useAppSelector } from "@/lib/hooks";
import { selectAppointments } from "@/lib/features/appointments/appointmentsSlice";

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getStyledDateSelectorStringByCalendarDate = (clendarDate) =>
  `[aria-label="${days[new Date(clendarDate.toDate("PST")).getDay()]}, ${
    monthNames[clendarDate.month - 1]
  } ${clendarDate.day}, ${clendarDate.year}"]`;

export default function AppointmentCalendar() {
  const appointments = useAppSelector(selectAppointments);
  const styledDateSelector = appointments
    .map((apt) =>
      getStyledDateSelectorStringByCalendarDate(
        parseDate(apt.date.toISOString().split("T")[0])
      )
    )
    .join(",");

  const CustomizedCalendar = styled.div`
    ${styledDateSelector} {
      background-color: lightgray;
    }
  `;
  return (
    <CustomizedCalendar>
      <Calendar
        defaultValue={parseDate(new Date().toISOString().split("T")[0])}
      />
    </CustomizedCalendar>
  );
}
