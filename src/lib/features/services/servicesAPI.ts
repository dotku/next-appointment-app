import { dummyServices } from "./servicesSlice";

export const fetchServices = async (services: typeof dummyServices) => {
  const result = { data: services };
  return result;
};
