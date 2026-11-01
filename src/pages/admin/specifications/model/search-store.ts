// src/stores/counter-store.ts
import { create } from "zustand";
import { SearchType } from "../config/constants";

export type SearchState = {
  searchValues: Record<SearchType, string>;
};

export type SearchActions = {
  setSearchValue: (type: SearchType, value: string) => void;
  clearSearch: (type?: SearchType) => void;
};

export type SearchStore = SearchState & SearchActions;

export const initSearchState: SearchState = {
  searchValues: { groups: "", specifications: "" },
};

export const useSearchStore = create<SearchStore>((set) => ({
  ...initSearchState,
  setSearchValue: (type, value) =>
    set((state) => ({
      ...state,
      values: { ...state.searchValues, [type]: value },
    })),
  clearSearch: (type) =>
    set((state) => ({
      ...state,
      values: type
        ? { ...state.searchValues, [type]: "" }
        : initSearchState.searchValues,
    })),
}));
