"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";

const ReactApp = dynamic(() => import("./App"), { ssr: false });

export default function App() {
  console.log("clients");
  useEffect(() => {
    console.log(
      "client: NEXT_PUBLIC_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );
    console.log(
      "REACT_NEXT_PUBLIC_SUPABASE_URL",
      process.env,
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY
    );
  }, []);

  return <ReactApp />;
}
