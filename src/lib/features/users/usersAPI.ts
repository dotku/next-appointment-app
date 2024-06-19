import { dummyUsers } from "./usersSlice";

export const fetchUsers = async (users: typeof dummyUsers) => {
  const result = { data: users };
  return result;
};
