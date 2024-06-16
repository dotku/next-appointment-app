import type { Metadata } from "next";
import AppNavbar from "../../src/components/Common/Navbar/AppNavbar";
import { useSupabaseSession } from "@/src/hooks/useSupabaseSession";
import { Spinner } from "@nextui-org/react";
import LayoutClient from "./LayoutClient";

export const metadata: Metadata = {
  title: "Appointment Booking App",
  description:
    "Appointment App is used to book appointment between customer and specialists.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutClient>{children}</LayoutClient>;
}
