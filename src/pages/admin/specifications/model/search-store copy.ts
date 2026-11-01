// src/stores/counter-store.ts
import { create } from "zustand";
import { SearchType } from "../config/constants";

export type SearchState = {
  type: SearchType;
  value: string;
};

export type SearchActions = {
  setSearch: (payload: SearchState) => void;
  clearSearch: () => void;
};

export type SearchStore = SearchState & SearchActions;

export const initSearchState: SearchState = {
  type: "groups",
  value: "",
};

export const useSearchStore = create<SearchStore>((set) => ({
  ...initSearchState,
  setSearch: (payload) => set((state) => ({ ...state, ...payload })),
  clearSearch: () => set(() => initSearchState),
}));
