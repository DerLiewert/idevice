import { Database } from "@/shared/api/database.types";
import { ExistingImage } from "./schemas";

// Выведенные типы из Supabase DB
type CategoriesTable = Database["public"]["Tables"]["categories"];

// Типы для UI
export type Category = CategoriesTable["Row"];
export type CategoryFull = Category & {
  image: CategoryImage | null;
};

export type CategoryImage = Omit<ExistingImage, "type">;

// Типы для запросов
export type CategoryInsertParams = Omit<CategoriesTable["Insert"], "id">;
export type CategoryUpdateParams = Omit<CategoriesTable["Update"], "id">;

export type CategoryUploadImage = {
  file: File;
  alt: string | null;
};

export type CreateCategoryResult =
  | {
      success: true;
      category: CategoryFull;
    }
  | {
      success: false;
      field: "name" | "slug" | "root";
      message: string;
    };
