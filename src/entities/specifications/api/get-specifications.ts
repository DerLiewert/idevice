"use server";
import { getSupabase } from "@/shared/api/supabase/server";

//========== GET ============================================================
export const getSpecifications = async () => {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("specifications")
    .select(
      `
    id,
    name,
    group:specifications_group (
      id,
      name
    )`,
    )
    .order("id", { ascending: true });

  if (error) throw new Error("Не удалось получить список характеристик.");

  return data;
};
