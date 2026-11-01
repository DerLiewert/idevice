"use server";
import { getSupabase } from "@/shared/api/supabase/server";
import { CategoryFull } from "../model/types";

//========== GET ============================================================

export const getCategories = async (): Promise<CategoryFull[]> => {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      image:images (
        id,
        src: storage_path,
        alt
      )`,
    )
    .order("id", { ascending: true });

  if (error) throw new Error("Не удалось получить список категорий");

  return data.map((category) => {
    const image = category.image[0];
    return {
      ...category,
      image: {
        ...image,
        src: supabase.storage.from("images").getPublicUrl(image.src).data
          .publicUrl,
      },
    };
  });

  // если почему-то в будущем захочется несколько картинок для категории (бд позволяет хранить несколько, а не одну)

  // return data.map((category) => ({
  //   ...category,
  //   image: category.image.map((image) => ({
  //     ...image,
  //     src: supabase.storage.from("images").getPublicUrl(image.src).data
  //       .publicUrl,
  //   })),
  // }));
};
