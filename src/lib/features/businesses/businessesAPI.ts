import { dummyBusinesses } from "./businessesSlice";

export const fetchCompanies = async (users: typeof dummyBusinesses) => {
  const result = { data: users };
  return result;
};
