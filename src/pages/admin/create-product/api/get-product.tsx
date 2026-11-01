"use server";
import { getSupabase } from "@/shared/api/supabase/server";
import {
  CreateProductResult,
  ProductFull,
  ProductInsertParams,
  ProductUploadImage,
} from "../model/types";

//========== GET ============================================================
export const getProduct = async (id: number): Promise<ProductFull> => {
  const supabase = await getSupabase();

  // 1. Создаем товар
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories (
        id,
        name,
        slug
      ),
      images:images (
        id,
        src: storage_path,
        alt
      )`,
    )
    .eq("id", id)
    .single();

  if (productError) throw new Error("Не удалось получить данные о товаре");

  // return product;
  return {
    ...product,
    images: product.images.map((image) => ({
      ...image,
      src: supabase.storage.from("images").getPublicUrl(image.src).data
        .publicUrl,
    })),
  };
};

//========== GET ============================================================
export const getProducts = async (): Promise<ProductFull[]> => {
  const supabase = await getSupabase();

  // 1. Создаем товар
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories (
        id,
        name,
        slug
      ),
      images:images (
        id,
        src: storage_path,
        alt
      )`,
    )
    .order("id", { ascending: true });

  if (productsError) throw new Error("Не удалось получить данные о товаре");

  return products.map((product) => ({
    ...product,
    images: product.images.map((image) => ({
      ...image,
      src: supabase.storage.from("images").getPublicUrl(image.src).data
        .publicUrl,
    })),
  }));
};
