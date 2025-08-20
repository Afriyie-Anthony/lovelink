import { create } from "zustand";
import { MatchState } from "../types/Match";

export const useMatchStore = create<MatchState>((set) => ({
  matches: [],
  selectedMatch: null,
  
  setMatches: (matches) => set({ matches }),
  addMatch: (match) => set((state) => ({ matches: [...state.matches, match] })),
  updateMatch: (id, updates) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
  removeMatch: (id) =>
    set((state) => ({
      matches: state.matches.filter((m) => m.id !== id),
    })),
  selectMatch: (match) => set({ selectedMatch: match }),
}));
