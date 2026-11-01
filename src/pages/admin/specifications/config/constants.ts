export const searchTypes = ["groups", "specifications"] as const;
export type SearchType = (typeof searchTypes)[number];

export const searchTypeOptions: { value: SearchType; label: string }[] = [
  { value: "groups", label: "Группы характеристик" },
  { value: "specifications", label: "Характеристики" },
];

export const ALL_SPECIFICATIONS_GROUP = {
  id: null,
  name: "Все характеристики",
} as const;
