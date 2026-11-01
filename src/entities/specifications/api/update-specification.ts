"use server";
import { getSupabase } from "@/shared/api/supabase/server";
import { SpecificationsUpdate } from "../model/types";

//========== UPDATE ============================================================
export const updateSpecification = async (
  id: number,
  payload: SpecificationsUpdate,
) => {
  const supabase = await getSupabase();

  const { id: _, ...params } = payload;
  const { data, error } = await supabase
    .from("specifications")
    .update(params)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    switch (error.code) {
      case "23505":
        throw new Error(
          "Характеирика с таким названием уже существует для этой группы.",
        );
      case "PGRST116":
        throw new Error("Характеирика не найдена.");
      default:
        throw new Error("Не удалось обновить характеирику.");
    }
  }

  return data;
};
