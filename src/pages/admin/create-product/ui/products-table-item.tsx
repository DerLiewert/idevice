"use client";
import Image from "next/image";
import { ImageOffIcon } from "lucide-react";
import { ActionDropdownMenu, Checkbox, TableCell, TableRow } from "@/shared/ui";
import { ProductFull, tableCols } from "../model";
import { cn } from "cn";

type CProductsTableItemProps = {
  product: ProductFull;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onEdit: (product: ProductFull) => void;
  onDelete: (id: number) => void;
};

export const ProductsTableItem = ({
  product,
  checked,
  onCheckedChange,
  onEdit,
  onDelete,
}: CProductsTableItemProps) => {
  return (
    <TableRow className="bg-background even:bg-green-200">
      <TableCell className="sticky left-0 bg-inherit">
        <Checkbox
          className="mx-auto"
          name={`product_${product.id}`}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </TableCell>

      {tableCols.map((col) => {
        if (col.value === "images") {
          const image = product[col.value][0];
          return (
            <TableCell key={col.value}>
              {image ? (
                <Image
                  src={image.src || "/"}
                  alt={image.alt || "Изображение товара " + product.name}
                  width="50"
                  height="50"
                  className="mx-auto h-auto max-h-12.5 w-auto max-w-12.5 object-contain"
                />
              ) : (
                <ImageOffIcon
                  size="18"
                  strokeWidth="1.5px"
                  className="mx-auto"
                />
              )}
            </TableCell>
          );
        } else {
          return (
            <TableCell
              key={col.value}
              className={cn("overflow-hidden", {
                // "w-full max-w-20 overflow-hidden": col.value === "description",
              })}
            >
              {col.value === "category"
                ? product[col.value].name
                : product[col.value]}
            </TableCell>
          );
        }
      })}

      <TableCell className="sticky right-0 bg-inherit">
        <ActionDropdownMenu
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product.id)}
        />
      </TableCell>
    </TableRow>
  );
};
