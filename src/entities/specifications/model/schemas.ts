import z from "zod";

export const SpecificationSchema = z.object({
  name: z.string().trim().min(1, "Введите название характеристики"),
  group_id: z.number("Выберите группу"),
});
export type SpecificationFormData = z.infer<typeof SpecificationSchema>;
