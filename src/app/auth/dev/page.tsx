// @note debug only

"use client";

import { useEffect, useState } from "react";
import { Session, createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "@nextui-org/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const AppAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<"sign_in" | "sign_up" | null>(null);

  const handleViewChange = (event: any) => {
    if (event.type === "view:sign_in") {
      setView("sign_in");
    } else if (event.type === "view:sign_up") {
      setView("sign_up");
    }
  };

  supabase.auth.onAuthStateChange((event) => {
    console.log("supabase.auth.onAuthStateChange", event);
    handleViewChange(event);
  });

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    // Listen for changes in the authentication state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); // Clear session state after logging out
  };

  console.log("view", view);

  return (
    <div className="w-80 mx-auto" style={{ marginTop: 40 }}>
      {session ? (
        <div>
          <p>Welcome, {session.user.email}!</p>
          <Button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 rounded"
            variant="bordered"
          >
            Logout
          </Button>
        </div>
      ) : (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          view="sign_in"
          redirectTo="/auth"
        />
      )}
    </div>
  );
};

export default AppAuth;
