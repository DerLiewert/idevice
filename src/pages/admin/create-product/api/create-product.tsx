"use server";
import { getSupabase } from "@/shared/api/supabase/server";
import {
  CreateProductResult,
  ProductInsertParams,
  ProductUploadImage,
} from "../model/types";

//========== CREATE ============================================================
export const createProduct = async (
  payload: ProductInsertParams & { images: ProductUploadImage[] },
): Promise<CreateProductResult> => {
  const supabase = await getSupabase();
  const { images, ...params } = payload;

  // 1. Создаем товар
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert(params)
    .select("*")
    .single();

  if (productError) {
    if (productError.code === "23505") {
      if (productError.message.includes("products_category_slug_unique")) {
        return {
          success: false,
          field: "slug",
          message: "Товар с таким ярлыком уже существует для этой категории",
        };
      }
    }

    return {
      success: false,
      field: "root",
      message: "Не удалось создать товар",
    };
  }

  // if (error.code === "23505") {
  //   if (error.message.includes("products_slug_unique_idx")) {
  //     throw new Error("Товар с таким ярлыком уже существует");
  //   }

  //   throw new Error("Товар с такими уникальными данными уже существует");
  // }

  const results = await Promise.allSettled(
    images.map(async (image) => {
      const extension = image.file.name.split(".").pop();
      const storagePath = `products/${product.id}/${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(storagePath, image.file, {
          contentType: image.file.type,
          upsert: false,
        });

      if (error) throw error;

      return {
        storage_path: storagePath,
        alt: image.alt,
      };
    }),
  );

  const uploadedImages = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const hasErrors = results.some((result) => result.status === "rejected");

  if (hasErrors) {
    const paths = uploadedImages.map((image) => image.storage_path);

    if (paths.length > 0) {
      const { error: cleanupError } = await supabase.storage
        .from("images")
        .remove(paths);

      if (cleanupError) {
        console.error("Не удалось очистить загруженные файлы", cleanupError);
      }
    }

    throw new Error("Не удалось загрузить все изображения");
  }

  // 4. Создаём запись в images
  const { data: uploadImages, error: imageError } = await supabase
    .from("images")
    .insert(
      uploadedImages.map((image, index) => ({
        product_id: product.id,
        storage_path: image.storage_path,
        alt: image.alt,
        sort_order: index,
      })),
    )
    .select("id, alt, src:storage_path");

  if (imageError) {
    // удаляем файл из Storage и категорию в случае ошибки
    await supabase.storage
      .from("images")
      .remove(uploadedImages.map((img) => img.storage_path));
    await supabase.from("products").delete().eq("id", product.id);

    throw new Error("Не удалось сохранить изображения");
  }

  return {
    success: true,
    product: {
      ...product,
      images: uploadImages,
    },
  };
};
