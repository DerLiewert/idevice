import z from "zod";
import { ru } from "zod/locales";

z.config(ru());

const ExistingImageSchema = z.object({
  type: z.literal("existing"),
  id: z.number(),
  src: z.string().min(1, "Ссылка на изображение обязательна"),
  alt: z.string().nullable(),
});

const NewImageSchema = z.object({
  type: z.literal("new"),
  file: z
    .file("Загрузите изображение категории")
    .min(1, "Файл не должен быть пустым")
    .max(5 * 1024 * 1024, "Максимальный размер - 5 МБ")
    .mime(
      ["image/jpeg", "image/png", "image/webp"],
      "Допустимы JPEG, PNG и WebP",
    ),
  alt: z.string().nullable(),
});

export const FormImageSchema = z.discriminatedUnion("type", [
  ExistingImageSchema,
  NewImageSchema,
]);

export type ExistingImage = z.infer<typeof ExistingImageSchema>;
export type NewImage = z.infer<typeof NewImageSchema>;
export type FormImage = z.infer<typeof FormImageSchema>;

export const ImagesFormSchema = z.object({
  images: z
    .array(FormImageSchema)
    .min(1, "Загрузите хотя бы одно изображение товара"),
});

export type ImagesFormValues = z.infer<typeof ImagesFormSchema>;

export const ProductSchema = z.object({
  category_id: z.number("Категория обязательна"),
  name: z.string().trim().min(1, "Введите название товара"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(
      1,
      "Ярлык товара обязателен! Он будет использоваться для URL в качестве уникального адресса категории!",
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
  description: z.string().trim().optional(),
  images: z
    .array(FormImageSchema)
    .min(1, "Загрузите хотя бы одно изображение товара"),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
