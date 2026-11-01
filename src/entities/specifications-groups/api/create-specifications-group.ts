"use server";
import { getSupabase } from "@/shared/api/supabase/server";
import { SpecificationGroupInsert } from "../model/types";

//========== CREATE ============================================================
export const createSpecificationsGroup = async (
  payload: SpecificationGroupInsert,
) => {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("specifications_group")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    switch (error.code) {
      case "23505":
        throw new Error("Группа с таким названием уже существует.");
      default:
        throw new Error("Не удалось создать группу.");
    }
  }

  return data;
};
