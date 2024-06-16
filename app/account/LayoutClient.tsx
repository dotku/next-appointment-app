"use client";

import AppNavbar from "@/src/components/Common/Navbar/AppNavbar";
import { useSupabaseSession } from "@/src/hooks/useSupabaseSession";
import { Spinner } from "@nextui-org/react";

export default function LayoutClient({ children }) {
  const { session } = useSupabaseSession();

  if (!session)
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <AppNavbar slug="account" maxWidth="full" />
      <div className="container mx-auto">{children}</div>
    </>
  );
}
