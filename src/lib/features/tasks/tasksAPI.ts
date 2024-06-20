import { dummyTasks } from "./tasksSlice";

export const fetchTasks = async (users: typeof dummyTasks) => {
  const result = { data: users };
  return result;
};
