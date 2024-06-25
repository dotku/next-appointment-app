import { updateUserDisplayName } from "@/src/app/api/auth/admin/utils";
export async function GET() {
  // id: 8f752d17-4394-4199-b3db-6805b5aa3f37
  const newUserName = "new name 123";
  const userID = "33982271-4a55-4129-90ba-4048c19ae2ce";
  try {
    await updateUserDisplayName(userID, newUserName);
  } catch (e) {
    return new Response(
      JSON.stringify({ error: `updateUserDisplayName failed: ${e.message}` }),
      {
        status: 500,
      }
    );
  }

  return Response.json({ name: newUserName });
}
