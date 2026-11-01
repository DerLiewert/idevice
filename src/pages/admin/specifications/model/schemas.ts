import z from "zod";
import { searchTypes } from "../config/constants";

//======== SearchSchema ========
export const SearchSchema = z.object({
  type: z.enum(searchTypes, "Выбран несуществующий вариант поиска"),
  value: z.string("Значение должно быть типа string").trim(),
});
export type SearchFormData = z.infer<typeof SearchSchema>;
