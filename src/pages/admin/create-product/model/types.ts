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

export type CategoryUploadImage = {
  file: File;
  alt: string | null;
};

//=========================================================================================================================================
type ProductsTable = Database["public"]["Tables"]["products"];

export type Product = Pick<
  ProductsTable["Row"],
  "id" | "name" | "slug" | "description"
> & {
  category: Category;
};

export type ProductFull = Product & { images: ProductImage[] };

export type ProductImage = Pick<ImagesDB, "id" | "alt"> & {
  src: ImagesDB["storage_path"];
};

// Типы для запросов
export type ProductInsertParams = Omit<ProductsTable["Insert"], "id">;
export type ProductInsertResponse = Pick<
  ProductsTable["Row"],
  "id" | "name" | "slug" | "description" | "category_id"
> & { images: ProductImage[] };

export type ProductUpdateParams = Omit<ProductsTable["Update"], "id">;
export type ProductUpdateResponse = Pick<
  ProductsTable["Row"],
  "id" | "name" | "slug" | "description" | "category_id"
> & { images: ProductImage[] };

export type ProductUploadImage = {
  file: File;
  alt: string | null;
};

export type CreateProductResult =
  | {
      success: true;
      product: ProductInsertResponse;
    }
  | {
      success: false;
      field: "name" | "slug" | "description" | "root";
      message: string;
    };
