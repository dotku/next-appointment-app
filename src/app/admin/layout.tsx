import type { Metadata } from "next";
import AppNavbar from "../../components/Common/Navbar/AppNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Appointment Booking App",
  description:
    "Appointment App is used to book appointment between customer and specialists.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar slug="admin" theme="dark" maxWidth="full" />
      <div className="flex">
        <div className="flex-none w-[19rem] pl-8 pr-6 mt-10">
          <AdminSidebar />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
