// app/api/users/route.js

import { supabaseAdmin } from "@/src/services/supabaseAdmin";

export async function GET(req) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
