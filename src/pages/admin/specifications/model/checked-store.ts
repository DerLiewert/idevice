import { create } from "zustand";

export type CheckedState = {
  groups: Set<number>;
  specifications: Set<number>;
};

export type CheckedPayload = { entity: keyof CheckedState; id: number };
export type CheckedActions = {
  setChecked: (payload: CheckedPayload) => void;
  setUnchecked: (payload: CheckedPayload) => void;
  clearChecked: (entity: keyof CheckedState) => void;
};

export type CheckedStore = CheckedState & CheckedActions;

export const initCheckedState: CheckedState = {
  groups: new Set(),
  specifications: new Set(),
};

export const useCheckedStore = create<CheckedStore>((set) => ({
  ...initCheckedState,
  setChecked: ({ entity, id }) =>
    set((state) => {
      return {
        ...state,
        [entity]: new Set(state[entity]).add(id),
      };
    }),
  setUnchecked: ({ entity, id }) =>
    set((state) => {
      const checked = new Set(state[entity]);
      checked.delete(id);
      return {
        ...state,
        [entity]: checked,
      };
    }),
  clearChecked: (entite) => {
    set((state) => ({ ...state, [entite]: new Set([]) }));
  },
}));
