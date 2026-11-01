import type { Metadata } from "next";
import { CategoryForm } from "./ui/category-form";
import { DataViewer } from "./ui/data-viewer";
import { getCategories } from "@/entities/categories";
import { PageHeader } from "@/shared/ui/page-header";

export const metadata: Metadata = {
  title: "iDevise | Админ | Категории",
};

export const CategoriesPage = async () => {
  const categories = await getCategories();
  return (
    <>
      <PageHeader
        title="Категории товаров"
        description="Здесь вы можете управлять категориями товаров магазина. Для изменения порядка категорий во фронтэнде просто перетаскивайте их."
      />
      <div className="container">
        <div className="flex gap-12.5">
          <CategoryForm className="basis-122.5" role="add" />
          <DataViewer
            className="w-full max-w-220 flex-1"
            categories={categories}
          />
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
