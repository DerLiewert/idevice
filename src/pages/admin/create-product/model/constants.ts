import { ProductFull } from "./types";

export const tableCols: { value: keyof ProductFull; label: string }[] = [
  { value: "images", label: "Изображение" },
  { value: "name", label: "Название" },
  { value: "slug", label: "Ярлык" },
  { value: "category", label: "Категория" },
  { value: "description", label: "Описание" },
];
