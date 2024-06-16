import type { Metadata } from "next";
import AppNavbar from "../../src/components/Common/Navbar/AppNavbar";
import { Link, Navbar, NavbarBrand } from "@nextui-org/react";

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
      <Navbar>
        <NavbarBrand className="flex justify-center">
          <Link className="font-bold text-inherit" href="/">
            AptApp
          </Link>
        </NavbarBrand>
      </Navbar>
      <div className="container mx-auto px-6">{children}</div>
    </>
  );
}
