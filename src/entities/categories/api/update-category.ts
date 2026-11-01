"use server";
import { getSupabase } from "@/shared/api/supabase/server";
import { CategoryFull } from "../model/types";
import { CategoryFormData } from "../model/schemas";

//========== UPDATE ============================================================
export async function updateCategory(
  id: number,
  payload: CategoryFormData,
  returnCategory: true,
): Promise<CategoryFull>;

export async function updateCategory(
  id: number,
  payload: CategoryFormData,
  returnCategory?: false,
): Promise<void>;

// Если isReturnedValue - возвращать обновленные данные.
// По умолчанию отключено, чтоб не делать лишний запрос для получения обновленной категории
// P.S. Просто на всякий случай, если уже реализовал, чтоб зря не удалять :)
export async function updateCategory(
  id: number,
  payload: CategoryFormData,
  isReturnedValue = false,
): Promise<CategoryFull | void> {
  const supabase = await getSupabase();
  const { image, ...params } = payload;

  const newStoragePath =
    image.type === "new"
      ? `categories/${id}/${crypto.randomUUID()}.${image.file.name.split(".").pop()}`
      : undefined;

  // 1. Загружаем новый файл до изменения БД
  if (image.type === "new" && newStoragePath) {
    const { error } = await supabase.storage
      .from("images")
      .upload(newStoragePath, image.file, {
        contentType: image.file.type,
        upsert: false,
      });

    if (error) {
      throw new Error("Не удалось загрузить новое изображение");
    }
  }

  // 2. Обновляем таблицы через RPC функцию
  // (сделано на стороне БД, чтоб если где-то упадет ошибка, то все внесенные изменения до ошибки откатились обратно)
  const { data, error } = await supabase.rpc("update_category_with_image", {
    p_category_id: id,
    p_name: params.name,
    p_slug: params.slug,
    p_image_action:
      image.type === "new"
        ? "replace"
        : image.type === "existing"
          ? "keep"
          : "remove",
    p_storage_path: newStoragePath,
    p_image_alt: image.alt,
  });

  if (error) {
    if (newStoragePath) {
      const { error: cleanupError } = await supabase.storage
        .from("images")
        .remove([newStoragePath]);

      if (cleanupError) {
        console.error("Не удалось удалить новый файл:", cleanupError);
      }
    }

    if (error.code === "23505") {
      throw new Error("Название или ярлык категории уже используются");
    }

    throw new Error("Не удалось обновить категорию");
  }

  // 3. Удаляем старый файл после успешного изменения БД
  const oldStoragePath = data?.[0]?.old_storage_path;

  if (oldStoragePath && image.type !== "existing") {
    const { error: cleanupError } = await supabase.storage
      .from("images")
      .remove([oldStoragePath]);

    if (cleanupError) {
      console.error("Не удалось удалить старое изображение:", cleanupError);
    }
  }

  if (!isReturnedValue) return;

  // 4. Получаем актуальную категорию
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select(
      `
      *,
      image:images (
        id,
        storage_path,
        alt
      )`,
    )
    .eq("id", id)
    .single();

  if (categoryError) {
    throw new Error("Не удалось получить обновлённую категорию");
  }

  const categoryImage = categoryData.image[0] ?? null;
  const resultImage = categoryImage
    ? {
        id: categoryImage.id,
        src: supabase.storage
          .from("images")
          .getPublicUrl(categoryImage.storage_path).data.publicUrl,
        alt: categoryImage.alt,
      }
    : null;

  return {
    ...categoryData,
    image: resultImage,
  };
}
