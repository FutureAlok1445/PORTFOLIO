import { createContext, useContext } from "react";
export const ExperienceContext = createContext(null);
export function useExperience() {
  return useContext(ExperienceContext);
}
