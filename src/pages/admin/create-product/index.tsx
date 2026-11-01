import type { Metadata } from "next";
import { ProductForm } from "./ui/product-form";
import { getProducts } from "./api/get-product";
import { DataViewer } from "./ui/data-viewer";
import { getCategories } from "@/entities/categories";
import { PageHeader } from "@/shared/ui/page-header";

export const metadata: Metadata = {
  title: "iDevise | Админ | Создать товар",
};

export const CreateProductPage = async () => {
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <>
      <PageHeader
        title="Добавить товар"
        description="Здесь вы можете добавить товар и его общие характеристики, котрые не разнятся у разных вариантов этого товара, если они у него есть."
      />
      <div className="container mb-10!">
        <ProductForm role="add" categories={categories} />
      </div>
      <div className="container">
        <DataViewer products={products} categories={categories} />
      </div>
    </>
  );
};

export default CreateProductPage;
