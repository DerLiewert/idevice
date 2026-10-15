import { create } from "zustand";

export type SearchState = {
  value: string;
};

export type SearchActions = {
  setSearchValue: (value: string) => void;
  clearSearchValue: () => void;
};

export type SearchStore = SearchState & SearchActions;

export const initialState: SearchState = {
  value: "",
};

export const useSearchStore = create<SearchStore>((set) => ({
  ...initialState,
  setSearchValue: (value) => set((state) => ({ ...state, value })),
  clearSearchValue: () => set(() => initialState),
}));
