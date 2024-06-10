import { dummyCompanies } from "./companiesSlice";

export const fetchCompanies = async (users: typeof dummyCompanies) => {
  const result = { data: users };
  return result;
};
