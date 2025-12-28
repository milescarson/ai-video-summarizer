import { create } from "zustand";
import { ReviewState } from "./types";

export const useReviewStore = create<ReviewState>((set) => ({
  prUrl: "",
  setPrUrl: (url: string) => set({ prUrl: url }),
  clearPrUrl: () => set({ prUrl: "" }),
}));
