"use client";
import { ImageIcon } from "lucide-react";
import { cn } from "cn";
import {
  Checkbox,
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import { ProductFull, tableCols } from "../model";
import { ProductsTableItem } from "./products-table-item";

type DataTabelProps = {
  searchValue: string;
  products: ProductFull[];
  checkedProducts: Set<number>;
  onCheckedChange: (checked: boolean, id: number) => void;
  onAllCheckedChange: (checked: boolean) => void;
  onProductEdit: (product: ProductFull) => void;
  onProductDelete: (id: number) => void;
};

export const ProductsTabel = ({
  searchValue,
  products,
  checkedProducts,
  onCheckedChange,
  onAllCheckedChange,
  onProductEdit,
  onProductDelete,
}: DataTabelProps) => {
  return (
    <Table className="table-fixed">
      {/* Показывать, если пустой список товаров */}
      {products.length === 0 && (
        <TableCaption>
          Не найдено товаров по запросу "{searchValue}"
        </TableCaption>
      )}

      {/* Header таблицы */}
      <TableHeader className="sticky top-0 right-0 left-0 z-2">
        <TableRow className="bg-primary **:text-white!">
          <TableHead className="dark sticky left-0 w-9 max-w-9 min-w-9 bg-inherit">
            <Checkbox
              className="mx-auto"
              checked={
                products.length > 0 &&
                products.every(({ id }) => checkedProducts.has(id))
              }
              onCheckedChange={onAllCheckedChange}
            />
          </TableHead>

          {tableCols.map((col) => (
            <TableHead
              key={col.value}
              className={cn({
                "w-15 min-w-12.5": col.value === "images",
                "w-120 max-w-120": col.value === "description",
              })}
            >
              {col.value === "images" ? (
                <ImageIcon size="18" className="mx-auto" />
              ) : (
                col.label
              )}
            </TableHead>
          ))}

          <TableHead className="sticky right-0 w-10 max-w-10 min-w-10 bg-inherit"></TableHead>
        </TableRow>
      </TableHeader>

      {/* Body таблицы */}
      <TableBody>
        {products.map((product) => (
          <ProductsTableItem
            key={product.id}
            product={product}
            checked={checkedProducts.has(product.id)}
            onCheckedChange={(checked) => onCheckedChange(checked, product.id)}
            onEdit={onProductEdit}
            onDelete={onProductDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
};
