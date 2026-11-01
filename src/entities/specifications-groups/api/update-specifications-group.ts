"use server";
import { getSupabase } from "@/shared/api/supabase/server";
import { SpecificationGroupUpdate } from "../model/types";

//========== UPDATE ============================================================
export const updateSpecificationsGroup = async (
  id: number,
  payload: SpecificationGroupUpdate,
) => {
  const supabase = await getSupabase();

  const { id: _, ...params } = payload;
  const { data, error } = await supabase
    .from("specifications_group")
    .update(params)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    switch (error.code) {
      case "23505":
        throw new Error("Группа с таким названием уже существует.");
      case "PGRST116":
        throw new Error("Группа не найдена.");
      default:
        throw new Error("Не удалось обновить группу.");
    }
  }

  return data;
};
