"use server";
import { getSupabase } from "@/shared/api/supabase/server";

const removeProductImages = async (paths: string[]) => {
  // Если упадет ошибка, то изабраженитя остануться в storage sapabase,
  // но товары уже были удалены до этого и повторно удалить не получится
  // Можно будет когда-то доработать и в случае ошибки удаления изображений сохранять ссылки на неудаленные в отдульную таблицу и через отдульную страницу отображать такие изображения и отдельным запросом удалять их еще раз
  if (paths.length === 0) return;

  const supabase = await getSupabase();

  const { error } = await supabase.storage.from("images").remove(paths);

  if (error) {
    console.error("Не удалось удалить изображения товаров:", {
      paths,
      error,
    });

    throw new Error(
      "Товары удалены, но не удалось удалить некоторые изображения",
    );
  }
};

//========== DELETE ONE ============================================================
export const deleteProduct = async (id: number): Promise<void> => {
  const supabase = await getSupabase();

  // 1. Получаем изображения категории
  const { data: images, error: fetchError } = await supabase
    .from("images")
    .select("storage_path")
    .eq("product_id", id);

  if (fetchError) {
    throw new Error("Не удалось получить изображения категории");
  }

  // 2. Удаляем категорию
  // images удалятся автоматически через ON DELETE CASCADE на стороне БД
  const { data: deletedProducts, error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("id")
    .single();

  if (deleteError) {
    throw new Error("Не удалось удалить товар");
  }

  if (!deletedProducts) {
    // throw new Error("Товар не найден");
    console.log("Товар не найден");
  }

  // 3. Удаляем файлы из Storage
  removeProductImages(images.map((image) => image.storage_path));
};

//========== DELETE All ============================================================
export const deleteProducts = async (ids: number[]): Promise<void> => {
  const uniqueIds = [...new Set(ids)];
  if (uniqueIds.length === 0) return;

  const supabase = await getSupabase();

  // 1. Получаем изображения категорий
  const { data: images, error: fetchError } = await supabase
    .from("images")
    .select("storage_path")
    .in("product_id", uniqueIds);

  if (fetchError) {
    throw new Error("Не удалось получить изображения товаров");
  }

  // 2. Удаляем категории
  // images удалятся автоматически через ON DELETE CASCADE
  const { data: deletedProducts, error: deleteError } = await supabase
    .from("products")
    .delete()
    .in("id", uniqueIds)
    .select("id");

  if (deleteError) {
    throw new Error("Не удалось удалить товары");
  }

  if (deletedProducts.length !== uniqueIds.length) {
    const deletedIds = new Set(deletedProducts.map(({ id }) => id));
    const notFoundIds = uniqueIds.filter((id) => !deletedIds.has(id));

    console.log(`Товары не найдены (ID: ${notFoundIds.join(", ")})`);

    // throw new Error(`Товары не найдены (ID: ${notFoundIds.join(", ")})`);\

    // Найденные товары в любом случае удалились. Если не нужно удалять товары, если хотя бы один из ID не был найден при удалении,
    // то лучше сделать проверку существования всех ID внутри одной RPC-функции через SQL в sapabase
  }

  // 3. Удаляем файлы из Storage
  removeProductImages(images.map((image) => image.storage_path));
};
