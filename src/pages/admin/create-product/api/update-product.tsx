"use server";
import { getSupabase } from "@/shared/api/supabase/server";
import { ProductUpdateResponse } from "../model/types";
import { ProductFormData } from "../model/schemas";
//========== UPDATE ============================================================

export async function updateProduct(
  id: number,
  payload: ProductFormData,
  returnProduct: true,
): Promise<ProductUpdateResponse>;

export async function updateProduct(
  id: number,
  payload: ProductFormData,
  returnProduct?: false,
): Promise<void>;

export async function updateProduct(
  id: number,
  payload: ProductFormData,
  isReturnedValue = false,
): Promise<ProductUpdateResponse | void> {
  const supabase = await getSupabase();
  const { images, ...params } = payload;

  // 1. Загружаем новые изображения в Storage
  const uploadResults = await Promise.allSettled(
    images.map(async (image) => {
      if (image.type === "existing") {
        return null;
      }

      const extension = image.file.name.split(".").pop();

      const storagePath = `products/${id}/${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(storagePath, image.file, {
          contentType: image.file.type,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      return {
        storage_path: storagePath,
        alt: image.alt,
      };
    }),
  );

  const uploadedImages = uploadResults.flatMap((result) =>
    result.status === "fulfilled" && result.value ? [result.value] : [],
  );

  const hasUploadErrors = uploadResults.some(
    (result) => result.status === "rejected",
  );

  // Если загрузка хотя бы одного файла не удалась,
  // удаляем файлы, которые успели загрузиться
  if (hasUploadErrors) {
    const paths = uploadedImages.map((image) => image.storage_path);

    if (paths.length > 0) {
      const { error } = await supabase.storage.from("images").remove(paths);

      if (error) {
        console.error("Не удалось очистить загруженные файлы:", error);
      }
    }

    throw new Error("Не удалось загрузить все изображения");
  }

  // 2. Формируем массив для RPC.
  // Существующие изображения передаём по id,
  // новые — по пути в Storage.
  let uploadedIndex = 0;

  const rpcImages = images.map((image, index) => {
    if (image.type === "existing") {
      return {
        id: image.id,
        alt: image.alt,
        sort_order: index,
      };
    }

    const uploadedImage = uploadedImages[uploadedIndex++];

    return {
      storage_path: uploadedImage.storage_path,
      alt: uploadedImage.alt,
      sort_order: index,
    };
  });

  // 3. Обновляем товар и его изображения в одной транзакции
  const { data, error } = await supabase.rpc("update_product_with_images", {
    p_product_id: id,
    p_category_id: params.category_id,
    p_name: params.name,
    p_slug: params.slug,
    p_images: rpcImages,
  });

  if (error) {
    // БД не обновилась — удаляем новые файлы из Storage
    const paths = uploadedImages.map((image) => image.storage_path);

    if (paths.length > 0) {
      const { error: cleanupError } = await supabase.storage
        .from("images")
        .remove(paths);

      if (cleanupError) {
        console.error("Не удалось удалить новые изображения:", cleanupError);
      }
    }

    if (error.code === "23505") {
      throw new Error(
        "Товар с таким ярлыком уже существует для этой категории",
      );
    }

    throw new Error("Не удалось обновить товар");
  }

  // 4. Удаляем файлы изображений, удалённых из товара
  const oldPaths = data
    .map((image) => image.old_storage_path)
    .filter((path): path is string => path !== null);

  if (oldPaths.length > 0) {
    const { error: cleanupError } = await supabase.storage
      .from("images")
      .remove(oldPaths);

    if (cleanupError) {
      console.error("Не удалось удалить старые изображения:", cleanupError);
    }
  }

  if (!isReturnedValue) return;

  // 5. Получаем актуальный товар
  const { data: productData, error: productError } = await supabase
    .from("products")
    .select(
      `
      *,
      images (
        id,
        storage_path,
        alt,
        sort_order
      )
    `,
    )
    .eq("id", id)
    .single();

  if (productError) {
    throw new Error("Не удалось получить обновлённый товар");
  }

  const resultImages = [...productData.images]
    // .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => ({
      id: image.id,
      src: supabase.storage.from("images").getPublicUrl(image.storage_path).data
        .publicUrl,
      alt: image.alt,
    }));

  return {
    ...productData,
    images: resultImages,
  };
}
