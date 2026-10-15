"use server";
import { getSupabase } from "@/shared/lib/supabase/server";
import { SpecificationsInsert, SpecificationsUpdate } from "../model";

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
          "Характеирика с таким именем уже существует для этой группы.",
        );
      default:
        throw new Error("Не удалось создать характеирику.");
    }
  }

  return data;
};

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
          "Характеирика с таким именем уже существует для этой группы.",
        );
      case "PGRST116":
        throw new Error("Характеирика не найдена.");
      default:
        throw new Error("Не удалось обновить характеирику.");
    }
  }

  return data;
};

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
