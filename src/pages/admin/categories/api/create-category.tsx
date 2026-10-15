"use server";
import { getSupabase } from "@/shared/lib/supabase/server";
import {
  CategoryUploadImage,
  CategoryInsertParams,
  CreateCategoryResult,
} from "../model";

//========== CREATE ============================================================
export const createCategory = async (
  payload: CategoryInsertParams & { image: CategoryUploadImage },
): Promise<CreateCategoryResult> => {
  const supabase = await getSupabase();
  const { image, ...params } = payload;

  // 1. СОздаем категорию
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .insert(params)
    .select("*")
    .single();

  if (categoryError) {
    if (categoryError.code === "23505") {
      if (categoryError.message.includes("categories_name_unique")) {
        return {
          success: false,
          field: "name",
          message: "Категория с таким именем уже существует",
        };
      }

      if (categoryError.message.includes("categories_slug_unique")) {
        return {
          success: false,
          field: "slug",
          message: "Такой ярлык уже существует для одной из категорий",
        };
      }
    }

    return {
      success: false,
      field: "root",
      message: "Не удалось создать категорию",
    };
  }

  // 2. Формируем путь в Storage
  const extension = image.file.name.split(".").pop();
  const storagePath = `categories/${category.id}/${crypto.randomUUID()}.${extension}`;

  // 3. Загружаем картинку
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(storagePath, image.file, {
      contentType: image.file.type,
      upsert: false,
    });

  if (uploadError) {
    // чтобы не оставить категорию без картинки
    await supabase.from("categories").delete().eq("id", category.id);

    throw new Error("Не удалось загрузить изображение");
  }

  // 4. Создаём запись в images
  const { data: uploadImage, error: imageError } = await supabase
    .from("images")
    .insert({
      category_id: category.id,
      storage_path: storagePath,
      sort_order: 0,
      alt: image.alt,
    })
    .select("id, alt, src:storage_path")
    .single();

  if (imageError) {
    // удаляем файл из Storage и категорию в случае ошибки
    await supabase.storage.from("images").remove([storagePath]);
    await supabase.from("categories").delete().eq("id", category.id);

    throw new Error("Не удалось сохранить изображение");
  }

  return {
    success: true,
    category: {
      ...category,
      image: uploadImage,
    },
  };
};
