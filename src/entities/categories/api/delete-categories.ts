"use server";
import { getSupabase } from "@/shared/api/supabase/server";

//========== DELETE ONE ============================================================
export const deleteCategory = async (id: number) => {
  const supabase = await getSupabase();

  // 1. Получаем изображения категории
  const { data: images, error: fetchError } = await supabase
    .from("images")
    .select("storage_path")
    .eq("category_id", id);

  if (fetchError) {
    throw new Error("Не удалось получить изображения категории");
  }

  // 2. Удаляем категорию
  // images удалятся автоматически через ON DELETE CASCADE на стороне БД
  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error("Не удалось удалить категорию");
  }

  // 3. Удаляем файлы из Storage
  if (images.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("images")
      .remove(images.map((image) => image.storage_path));

    if (storageError) {
      throw new Error("Не удалось удалить изображения");
    }
  }
};

//========== DELETE All ============================================================
export const deleteCategories = async (ids: number[]) => {
  const supabase = await getSupabase();

  // 1. Получаем изображения категорий
  const { data: images, error: fetchError } = await supabase
    .from("images")
    .select("storage_path")
    .in("category_id", ids);

  if (fetchError) {
    throw new Error("Не удалось получить изображения категорий");
  }

  // 2. Удаляем категории
  // images удалятся автоматически через ON DELETE CASCADE
  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .in("id", ids);

  if (deleteError) {
    throw new Error("Не удалось удалить категории");
  }

  // 3. Удаляем файлы из Storage
  if (images.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("images")
      .remove(images.map((image) => image.storage_path));

    if (storageError) {
      throw new Error("Не удалось удалить изображения");
    }
  }
};
