"use client";
import { create } from "zustand";
import { fetchCourses, searchCourses, Course } from "@/lib/courseApi";

interface AppState {
  token: string | null;
  courses: Course[];
  setToken: (token: string) => void;
  loadCourses: () => Promise<void>;
  searchCourses: (query: string) => Promise<void>;
}

const useStore = create<AppState>((set, get) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  courses: [],

  setToken: (token) => {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
    set({ token });
  },

  loadCourses: async () => {
    const token = get().token;
    if (!token) return;

    // ✅ client-side cache
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("courses");
      if (cached) {
        set({ courses: JSON.parse(cached) });
        return;
      }
    }

    const data = await fetchCourses(token);
    if (typeof window !== "undefined") localStorage.setItem("courses", JSON.stringify(data));
    set({ courses: data });
  },

  searchCourses: async (query) => {
    const token = get().token;
    if (!token) return;
    const data = await searchCourses(query, token);
    set({ courses: data });
  },
}));

export default useStore;
