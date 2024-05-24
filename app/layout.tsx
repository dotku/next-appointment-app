import "../src/index.css";
import type { Metadata } from "next";

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
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
