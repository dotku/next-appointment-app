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

export async function PATCH(_req, { params }) {
  const { data: sessionData, error: sessionError } =
    await supabaseAdmin.auth.getSession();

  console.log("sessionData", sessionData);

  if (sessionError) {
    return new Response(JSON.stringify({ error: sessionError.message }), {
      status: 500,
    });
  }

  if (!sessionData.session) {
    const { data: newSessionData, error: newSessionError } =
      await supabaseAdmin.auth.refreshSession();
    const { session, user } = newSessionData;

    console.log("newSession", session, user);

    if (newSessionError) {
      return new Response(JSON.stringify({ error: newSessionError.message }), {
        status: 500,
      });
    }
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(params.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const { data: updatedData, error: updateError } =
    await supabaseAdmin.auth.updateUser({
      data: {
        display_name: "New Display Name",
      },
    });

  if (updateError) {
    console.error(updateError);
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 500,
    });
  } else {
    console.log("User's display name updated successfully!");
  }

  return Response.json({ data: updatedData });
}
