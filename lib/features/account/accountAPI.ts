import { Account } from "./accountSlice";

// A mock function to mimic making an async request for data
export const fetchAccount = async (account: Account) => {
  const response = await fetch("/api/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account }),
  });
  const result: { data: Account } = await response.json();

  return result;
};
