"use server";
import { getSupabase } from "@/shared/api/supabase/server";
import { Category } from "../model/types";

//========== GET ============================================================
export const getCategories = async (): Promise<Category[]> => {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error("Не удалось получить список категорий");

  return data;
};
