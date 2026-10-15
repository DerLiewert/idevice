import z from "zod";
import { searchTypes } from "./constants";

//======== SearchSchema ========
export const SearchSchema = z.object({
  type: z.enum(searchTypes, "Выбран несуществующий вариант поиска"),
  value: z.string("Значение должно быть типа string").trim(),
});
export type SearchFormData = z.infer<typeof SearchSchema>;

//======== GroupSchema ========
export const GroupSchema = z.object({
  name: z.string().trim().min(1, "Введите название группы характеристик"),
});
export type GroupFormData = z.infer<typeof GroupSchema>;

//======== SpecificationSchema ========
export const SpecificationSchema = z.object({
  name: z.string().trim().min(1, "Введите название характеристики"),
  group_id: z.number("Выберите группу"),
});
export type SpecificationFormData = z.infer<typeof SpecificationSchema>;
