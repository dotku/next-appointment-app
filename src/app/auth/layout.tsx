import type { Metadata } from "next";
import AuthClientLayout from "./AuthClientLayout";

export const metadata: Metadata = {
  title: "Appointment Booking App",
  description:
    "Appointment App is used to book appointment between customer and specialists.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthClientLayout>{children}</AuthClientLayout>;
}
