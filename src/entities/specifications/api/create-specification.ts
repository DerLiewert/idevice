"use server";
import { getSupabase } from "@/shared/api/supabase/server";
import { SpecificationsInsert } from "../model/types";

//========== CREATE ============================================================
export const createSpecification = async (payload: SpecificationsInsert) => {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("specifications")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    switch (error.code) {
      case "23505":
        throw new Error(
          "Характеирика с таким названием уже существует для этой группы.",
        );
      default:
        throw new Error("Не удалось создать характеирику.");
    }
  }

  return data;
};
