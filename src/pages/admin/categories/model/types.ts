import { Database } from "@/shared/api/database.types";

// Выведенные типы из Supabase DB
type CategoriesTable = Database["public"]["Tables"]["categories"];
type ImagesDB = Database["public"]["Tables"]["images"]["Row"];

// Типы для UI
export type Category = CategoriesTable["Row"];
export type CategoryFull = Category & {
  image: CategoryImage | null;
};

export type CategoryImage = Pick<ImagesDB, "id" | "alt"> & {
  src: ImagesDB["storage_path"];
};

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
