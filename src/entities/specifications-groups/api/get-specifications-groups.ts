"use server";
import { getSupabase } from "@/shared/api/supabase/server";

//========== GET ============================================================
export const getSpecificationsGroups = async () => {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("specifications_group")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error("Не удалось получить список групп.");

  return data;
};
