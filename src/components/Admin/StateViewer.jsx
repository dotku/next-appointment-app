import { useAppSelector } from "@/lib/hooks";
import { selectUsers } from "@/lib/features/users/usersSlice";
import { selectAppointments } from "@/lib/features/appointments/appointmentsSlice";
import { selectBusinesses } from "@/lib/features/businesses/businessesSlice";

export default function StateViewer() {
  const appointments = useAppSelector(selectAppointments);
  const users = useAppSelector(selectUsers);
  const businesses = useAppSelector(selectBusinesses);

  return (
    <>
      <h2 className="text-2xl mb-2">Appointment Database Viewer</h2>
      <h3 className="text-xl">Appointments</h3>
      <pre className="text-gray-400" style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(appointments, null, 2)}
      </pre>
      <h3 className="text-xl">Users</h3>
      <pre className="text-gray-400" style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(users, null, 2)}
      </pre>
      <h3 className="text-xl">Busineeses</h3>
      <pre className="text-gray-400" style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(businesses, null, 2)}
      </pre>
    </>
  );
}
