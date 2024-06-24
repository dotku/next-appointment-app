import { supabaseAdmin } from "@/src/services/supabaseAdmin";

export async function GET(_req, { params }) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(params.id);

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
