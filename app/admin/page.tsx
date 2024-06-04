"use client";
import dynamic from "next/dynamic";
// import Admin from "../../src/components/Admin";

const Admin = dynamic(() => import("@/src/components/Admin"), {
  ssr: false,
});

export default function AdminPage() {
  return (
    <div>
      <Admin />
    </div>
  );
}
