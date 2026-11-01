import { Database } from "@/shared/api/database.types";

export type SpecificationGroupTable =
  Database["public"]["Tables"]["specifications_group"];

export type SpecificationGroup = SpecificationGroupTable["Row"];
export type SpecificationGroupInsert = Omit<
  SpecificationGroupTable["Insert"],
  "id"
>;
export type SpecificationGroupUpdate = Omit<
  SpecificationGroupTable["Update"],
  "id"
> & { id?: never };
