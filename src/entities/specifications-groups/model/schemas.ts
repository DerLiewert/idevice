import z from "zod";

export const SpecificationsGroupSchema = z.object({
  name: z.string().trim().min(1, "Введите название группы характеристик"),
});
export type SpecificationsGroupFormData = z.infer<
  typeof SpecificationsGroupSchema
>;
