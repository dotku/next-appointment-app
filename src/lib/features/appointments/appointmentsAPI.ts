import { dummyAppointments } from "./appointmentsSlice";

export const fetchAppointments = async (users: typeof dummyAppointments) => {
  const result = { data: users };
  return result;
};
