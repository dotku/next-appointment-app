"use client";

import { useSupabaseSession } from "@/src/hooks/useSupabaseSession";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { session, error, isLoading } = useSupabaseSession();
  const [user, setUser] = useState(null);

  console.log(session);

  useEffect(() => {
    session && setUser(session.user);
  }, [session]);

  if (!user)
    return (
      <div className="flex">
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div classNmae="container mx-auto px-6">
      <div className="w-96">
        <h2 className="text-xl">Account</h2>
        <h3 className="text-xl">{user.name}</h3>
        {session?.user.id}
      </div>
    </div>
  );
}
