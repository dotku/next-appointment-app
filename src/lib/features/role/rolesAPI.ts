import { Role } from "./rolesSlice";

// A mock function to mimic making an async request for data
export const fetchRoles = async (roles: Role[]) => {
  const response = await fetch("/api/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([...roles]),
  });
  const result: { data: Role } = await response.json();

  return result;
};
