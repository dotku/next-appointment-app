import { dummySpecialists } from "./specialistsSlice";

export const fetchSpecialists = async (users: typeof dummySpecialists) => {
  const result = { data: users };
  return result;
};
