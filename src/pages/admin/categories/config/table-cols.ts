import { CategoryFull } from "@/entities/categories";


export const tableCols = [
  { value: "image", label: "Изображение" },
  { value: "name", label: "Название" },
  { value: "slug", label: "Ярлык" },
] as const satisfies readonly { value: keyof CategoryFull; label: string }[];
