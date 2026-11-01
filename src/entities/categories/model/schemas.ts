import z from "zod";

const ExistingImageSchema = z.object({
  type: z.literal("existing"),
  id: z.number(),
  src: z.string("Ссылка на изображение категории не может быть пустой"),
  alt: z.string().nullable(),
});

const NewImageSchema = z.object({
  type: z.literal("new"),
  file: z.file("Загрузите изображение категории"),
  alt: z.string().nullable(),
});

export const CategorySchema = z.object({
  name: z.string().trim().min(1, "Введите название категории"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(
      1,
      "Ярлык категории обязателен! Он будет использоваться для URL в качестве уникального адресса категории!",
    )
    .regex(
      /^(?!-)(?!.*-$)/,
      "Ярлык не должен начинаться или заканчиваться дефисом",
    )
    .regex(
      /^[a-z0-9-]+$/,
      "Ярлык может содержать только латинские буквы, цифры и дефисы",
    )
    .regex(
      /^(?!.*--)/,
      "Ярлык не должен содержать два и больше дефисов подряд",
    ),
  image: z.union([ExistingImageSchema, NewImageSchema], {
    error: "Загрузите изображение категории",
  }),
});

export type ExistingImage = z.infer<typeof ExistingImageSchema>;
export type NewImage = z.infer<typeof NewImageSchema>;
export type CategoryFormData = z.infer<typeof CategorySchema>;
