"use client";

import { useEffect, useState } from "react";
import supabase from "@/src/services/supabase";

export function useSupabaseSession() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        error
          ? setError("Failed to retrieve session: " + error.message)
          : setSession(data.session);
      } catch (err) {
        setError("Unexpected error: " + err.message);
      }
      setIsLoading(false);
    };

    getSession();
  }, []);

  return { session, error, isLoading };
}
