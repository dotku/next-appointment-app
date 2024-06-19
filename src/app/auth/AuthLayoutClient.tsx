"use client";

import AppNavbar from "@/src/components/Common/Navbar/AppNavbar";
import { useSupabaseSession } from "@/src/hooks/useSupabaseSession";
import { Spinner } from "@nextui-org/react";

export default function AuthClientLayout({ children }) {
  const { isLoading } = useSupabaseSession();

  return isLoading ? (
    <div className="flex h-screen justify-center items-center">
      <Spinner />
    </div>
  ) : (
    <>
      <AppNavbar slug="auth" />
      <div className="container mx-auto px-6">{children}</div>
    </>
  );
}
