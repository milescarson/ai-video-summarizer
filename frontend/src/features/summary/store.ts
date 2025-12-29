import { create } from "zustand";
import { SummaryState } from "./types";

export const useSummaryStore = create<SummaryState>((set) => ({
  videoUrl: "",
  setVideoUrl: (url: string) => set({ videoUrl: url }),
  clearVideoUrl: () => set({ videoUrl: "" }),
}));
