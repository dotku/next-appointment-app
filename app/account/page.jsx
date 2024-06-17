"use client";

import Account from "@/src/components/Account/Account";
import { useSupabaseSession } from "@/src/hooks/useSupabaseSession";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";

export default function AccountPage() {
  console.log("account page");
  const { session, error, isLoading } = useSupabaseSession();
  const [user, setUser] = useState(null);

  console.log(session, error);

  useEffect(() => {
    session && setUser(session.user);
  }, [session]);

  if (error) return <div>Error: {error}</div>;

  if (isLoading)
    return (
      <div className="flex">
        <Spinner />
      </div>
    );

  return (
    <div classNmae="container mx-auto px-6">
      <div className="w-96">
        <h2 className="text-xl">Account</h2>
        <h3 className="text-xl">{user.name}</h3>
        {session.user.id}
        <Account userID={session.user.id} />
      </div>
    </div>
  );
}
