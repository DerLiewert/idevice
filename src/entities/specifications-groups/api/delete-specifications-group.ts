"use server";
import { getSupabase } from "@/shared/api/supabase/server";

//========== DELETE ONE ============================================================
export const deleteSpecificationsGroup = async (id: number) => {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("specifications_group")
    .delete()
    .eq("id", id);

  if (error) {
    switch (error.code) {
      case "23503":
        throw new Error(
          "Нельзя удалить группу, пока в ней есть характеристики.",
        );
      default:
        throw new Error("Не удалось удалить группу.");
    }
  }
};

//========== DELETE MANY ============================================================
export const deleteSpecificationsGroups = async (ids: number[]) => {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("specifications_group")
    .delete()
    .in("id", ids);

  if (error) {
    switch (error.code) {
      case "23503":
        throw new Error(
          "Нельзя удалить группы, пока в них есть характеристики.",
        );
      default:
        throw new Error("Не удалось произвести удаление групп.");
    }
  }
};
