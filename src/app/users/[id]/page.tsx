import supabase from "@/src/services/supabase";

// This function is required to generate static parameters for each user ID.
export async function generateStaticParams() {
  // Mock data: Replace with your actual data source
  // const users = [{ userID: "1" }, { userID: "2" }, { userID: "3" }];
  const { data: users } = await supabase.from("profiles").select();

  console.log("users", users);

  // Generate the params object for each user ID
  return users.map((user) => ({
    params: {
      userID: user.userID,
    },
  }));
}

export default function UserIDPage({ params }) {
  return <>User ID Page: {JSON.stringify(params, null, 2)}</>;
}
