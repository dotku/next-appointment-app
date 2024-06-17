"use client";

import { useEffect, useState } from "react";
import supabase from "@/src/services/supabase";

export function useSupabaseRowsByUserID({ userID, table }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        let { data: profile_role, error } = await supabase
          .from(table)
          .select("*")
          .eq("profile_id", userID);

        console.log("profile_role", profile_role);

        if (error) {
          setError("Failed to retrieve session: " + error.message);
          return;
        }
        setData(profile_role);
        setIsLoading(false);
      } catch (err) {
        setError("Unexpected error: " + err.message);
      }
      setIsLoading(false);
    };

    getSession();
  }, []);

  return { data, error, isLoading };
}
