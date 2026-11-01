import { Database } from "@/shared/api/database.types";
import type { SpecificationGroup } from "@/entities/specifications-groups/@x/specifications";

export type SpecificationsTable =
  Database["public"]["Tables"]["specifications"];

export type Specification = SpecificationsTable["Row"];
export type SpecificationResponse = Pick<Specification, "id" | "name"> & {
  group: SpecificationGroup;
};

export type SpecificationsInsert = SpecificationsTable["Insert"];
export type SpecificationsUpdate = SpecificationsTable["Update"];
