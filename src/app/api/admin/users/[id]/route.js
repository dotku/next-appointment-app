// app/api/users/route.js

import { supabaseAdmin } from "@/src/services/supabaseAdmin";
// import type { NextApiRequest } from "next";

export async function GET(_req, { params }) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(params.id);
  // const router = useRouter();
  console.log("router", params);

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
