"use client";

import { useSupabaseSession } from "@/src/hooks/useSupabaseSession";
import AppNavbar from "../../Common/Navbar/AppNavbar";
import AdminSidebar from "../AdminSidebar";
import { Link } from "@nextui-org/react";

export default function AdminLayoutClient({ children }) {
  const { session } = useSupabaseSession();
  console.log("session", session);

  return (
    <>
      <AppNavbar slug="admin" theme="dark" maxWidth="full" />
      {session ? (
        <div className="flex">
          <div className="flex-none w-[19rem] pl-8 pr-6 mt-10">
            <AdminSidebar />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[32rem]">
          Please{" "}
          <Link href="/auth" className="pl-1">
            login
          </Link>
          .
        </div>
      )}
    </>
  );
}
