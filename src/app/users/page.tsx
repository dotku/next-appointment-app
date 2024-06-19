"use client";

import supabase from "@/src/services/supabase";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function genUsers() {
      const { data: users, error } = await supabase.from("profiles").select();
      if (error) {
        setError(error.message);
        return;
      }
      setUsers(users);
    }
    genUsers();
  }, []);
  return (
    <>
      <h1>Users Page</h1>
      {error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <pre>{JSON.stringify(users, null, 2)}</pre>
      )}
    </>
  );
}
