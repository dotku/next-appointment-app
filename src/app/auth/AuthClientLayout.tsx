"use client";

import { useSupabaseSession } from "@/src/hooks/useSupabaseSession";
import { Navbar, NavbarBrand, Spinner, Link } from "@nextui-org/react";

export default function AuthClientLayout({ children }) {
  const { isLoading } = useSupabaseSession();

  return isLoading ? (
    <div className="flex h-screen justify-center items-center">
      <Spinner />
    </div>
  ) : (
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
