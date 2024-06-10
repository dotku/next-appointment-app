import "../src/index.css";
import type { Metadata } from "next";
import StoreProvider from "./StoreProvider";

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
  const initialCount = 0;
  return (
    <html lang="en">
      <body>
        <div id="root">
          <StoreProvider>{children}</StoreProvider>
        </div>
      </body>
    </html>
  );
}
