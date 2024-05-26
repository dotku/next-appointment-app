import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";

const supabase = createClient(
  process.env.REACT_NEXT_PUBLIC_SUPABASE_URL,
  process.env.REACT_NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const AppAuth = () => <Auth supabaseClient={supabase} />;

export default AppAuth;
