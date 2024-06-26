import type { Metadata } from "next";
import AppNavbar from "../../components/Common/Navbar/AppNavbar";

export const metadata: Metadata = {
  title: "Appointment Booking App",
  description:
    "Appointment App is used to book appointment between customer and specialists.",
};

export default function AppointmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar slug="appointment" />
      <div className="container mx-auto px-6">{children}</div>
    </>
  );
}
