"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { Button, SearchInput, toast } from "@/shared/ui";
import { Category, ProductFull } from "../model/types";
import { deleteProduct, deleteProducts } from "../api/delete-products";
import { DeleteProductsDialog } from "./delete-products-dialog";
import { ProductsTabel } from "./products-table";
import { EditProductDialog } from "./edit-product-dialog";

type DataViewerProps = {
  className?: string;
  products: ProductFull[];
  categories: Category[];
};

export const DataViewer = ({
  className,
  products,
  categories,
}: DataViewerProps) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [deletedProduct, setDeletedProduct] = useState<number | null>(null);
  const [checkedProducts, setCheckedProducts] = useState<Set<number>>(
    new Set(),
  );
  const [editableProduct, setEdditableProduct] = useState<ProductFull | null>(
    null,
  );

  const searchProducts = searchValue
    ? products.filter((product) =>
        product.name
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()),
      )
    : products;
  const visibleChecked = searchProducts.filter(({ id }) =>
    checkedProducts.has(id),
  );

  const removeCheckedProducts = (ids: number[]) => {
    setCheckedProducts((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  };

  const handleCheckedChange = (checked: boolean, id: number) => {
    if (checked) {
      setCheckedProducts((prev) => new Set([...prev, id]));
    } else {
      removeCheckedProducts([id]);
    }
  };

  const handleAllCheckedChange = (checked: boolean) => {
    setCheckedProducts((prev) => {
      const next = new Set(prev);

      searchProducts.forEach(({ id }) =>
        checked ? next.add(id) : next.delete(id),
      );

      return next;
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <SearchInput value={searchValue} onChange={setSearchValue} placeholder="Поиск по названию товара" />

      <div className="flex max-h-100 border">
        <ProductsTabel
          searchValue={searchValue}
          products={searchProducts}
          checkedProducts={checkedProducts}
          onCheckedChange={handleCheckedChange}
          onAllCheckedChange={handleAllCheckedChange}
          onProductEdit={setEdditableProduct}
          onProductDelete={(id) => {
            setOpenAlertDialog(true);
            setDeletedProduct(id);
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* <p className="text-muted-foreground">Выбрано: {checkedProducts.size} / {products.length}</p> */}
        <p className="text-muted-foreground">
          Выбрано: {visibleChecked.length} / {searchProducts.length}
        </p>
        <Button
          type="button"
          variant="destructive"
          disabled={visibleChecked.length === 0}
          onClick={(e) => {
            e.preventDefault();
            setDeletedProduct(null);
            setOpenAlertDialog(true);
          }}
        >
          Удалить выбранные товары
        </Button>
      </div>

      {/* Модальное окно для подтверждения удаления товара(ов) */}
      <DeleteProductsDialog
        single={deletedProduct !== null}
        open={openAlertDialog}
        onOpenChange={setOpenAlertDialog}
        onDelete={async () => {
          let successToastText = null;

          if (deletedProduct !== null) {
            await deleteProduct(deletedProduct);

            removeCheckedProducts([deletedProduct]);
            setDeletedProduct(null);

            successToastText = "Товар успешно удален";
          } else {
            const idsToDelete = visibleChecked.map(({ id }) => id);

            await deleteProducts(idsToDelete);
            removeCheckedProducts(idsToDelete);

            successToastText = "Товары успешно удалены";
          }

          toast.add({
            type: "success",
            description: successToastText,
          });

          setOpenAlertDialog(false);
          router.refresh();
        }}
      />

      {/* Модальное окно для редактирования товаров */}
      <EditProductDialog
        item={editableProduct}
        onClose={() => setEdditableProduct(null)}
        onSuccess={() => setEdditableProduct(null)}
        categories={categories}
      />
    </div>
  );
};
