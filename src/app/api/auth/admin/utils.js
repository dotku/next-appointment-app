import { supabaseAdmin } from "@/src/services/supabaseAdmin";

export async function updateUserDisplayName(userId, newDisplayName) {
  console.log("updateUserDisplayName");
  const { data, error } = await w(userId, {
    user_metadata: { displayName: newDisplayName },
  });

  if (error) {
    console.error("Error updating user display name:", error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  } else {
    console.log("User display name updated successfully:", data);
  }
}
