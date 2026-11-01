"use server";
import { getSupabase } from "@/shared/api/supabase/server";

//========== DELETE ============================================================
export const deleteSpecification = async (id: number) => {
  const supabase = await getSupabase();

  const { error } = await supabase.from("specifications").delete().eq("id", id);

  if (error) throw new Error("Не удалось удалить характеристику.");
};

export const deleteSpecifications = async (ids: number[]) => {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("specifications")
    .delete()
    .in("id", ids);

  if (error) throw new Error("Не удалось произвести удаление характеристик.");
};
