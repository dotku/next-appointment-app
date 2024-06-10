import { useAppSelector } from "@/lib/hooks";
import { selectUsers } from "@/lib/features/users/usersSlice";
import { selectAppointments } from "@/lib/features/appointments/appointmentsSlice";

export default function StateViewer() {
  const appointments = useAppSelector(selectAppointments);
  const users = useAppSelector(selectUsers);

  return (
    <>
      <h2 className="text-2xl mb-2">Appointment Database Viewer</h2>
      <h3 className="text-xl">Users</h3>
      <pre className="text-gray-400">{JSON.stringify(users, null, 2)}</pre>
      <h3 className="text-xl">Appointments</h3>
      <pre className="text-gray-400">
        {JSON.stringify(appointments, null, 2)}
      </pre>
    </>
  );
}
