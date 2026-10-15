"use server";
import { getSupabase } from "@/shared/lib/supabase/server";
import { SpecificationGroupInsert, SpecificationGroupUpdate } from "../model";

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
        throw new Error("Группа с таким именем уже существует.");
      default:
        throw new Error("Не удалось создать группу.");
    }
  }

  return data;
};

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
        throw new Error("Группа с таким именем уже существует.");
      case "PGRST116":
        throw new Error("Группа не найдена.");
      default:
        throw new Error("Не удалось обновить группу.");
    }
  }

  return data;
};

//========== DELETE ============================================================
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

// export const deleteSpecificationsGroups = async (ids: number[]) => {
//   const supabase = await getSupabase();

//   // Проверяем, есть ли характеристики в выбранных группах
//   const { data: specifications, error: specificationsError } = await supabase
//     .from("specifications")
//     .select("group_id")
//     .in("group_id", ids);

//   if (specificationsError) {
//     throw new Error("Не удалось проверить группы перед удалением.");
//   }

//   const usedGroupIds = [
//     ...new Set(specifications.map(({ group_id }) => group_id)),
//   ];

//   if (usedGroupIds.length > 0) {
//     const { data: groups, error: groupsError } = await supabase
//       .from("specifications_group")
//       .select("id, name")
//       .in("id", usedGroupIds);

//     if (groupsError) {
//       throw new Error("Не удалось получить информацию о группах.");
//     }

//     const groupNames = groups.map(({ name }) => `«${name}»`).join(", ");

//     throw new Error(
//       `Нельзя удалить группы, пока в них есть характеристики: ${groupNames}.`,
//     );
//   }

//   // Само удаление
//   const { error } = await supabase
//     .from("specifications_group")
//     .delete()
//     .in("id", ids);

//   if (error) {
//     switch (error.code) {
//       case "23503":
//         throw new Error(
//           "Нельзя удалить группы, пока в них есть характеристики.",
//         );
//       default:
//         throw new Error("Не удалось произвести удаление групп.");
//     }
//   }
// };
