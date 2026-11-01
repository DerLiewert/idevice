"use client";
import Image from "next/image";
import { ImageOffIcon } from "lucide-react";
import { Checkbox, TableCell, TableRow, ActionDropdownMenu } from "@/shared/ui";
import { CategoryFull } from "@/entities/categories";
import { tableCols } from "../../config/table-cols";

type CategoriesTableItemProps = {
  category: CategoryFull;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onEdit: (category: CategoryFull) => void;
  onDelete: (id: number) => void;
};

export const CategoriesTableItem = ({
  category,
  checked,
  onCheckedChange,
  onEdit,
  onDelete,
}: CategoriesTableItemProps) => {
  return (
    <TableRow className="bg-background even:bg-green-200">
      <TableCell className="sticky left-0 bg-inherit">
        <Checkbox
          className="mx-auto"
          name={`category_${category.id}`}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </TableCell>

      {tableCols.map((col) => {
        if (col.value === "image") {
          const image = category[col.value];
          return (
            <TableCell key={col.value}>
              {image ? (
                <Image
                  src={image.src || "/"}
                  alt={image.alt || "Изображение категории " + category.name}
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
          return <TableCell key={col.value}>{category[col.value]}</TableCell>;
        }
      })}

      <TableCell className="sticky right-0 bg-inherit">
        <ActionDropdownMenu
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category.id)}
        />
      </TableCell>
    </TableRow>
  );
};
