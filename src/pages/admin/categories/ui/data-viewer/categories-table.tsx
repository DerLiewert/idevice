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
import { CategoriesTableItem } from "./categories-table-item";
import { tableCols } from "../../config/table-cols";
import { CategoryFull } from "@/entities/categories";

type DataTabelProps = {
  searchValue: string;
  categories: CategoryFull[];
  checkedCategories: Set<number>;
  onCheckedChange: (checked: boolean, id: number) => void;
  onAllCheckedChange: (checked: boolean) => void;
  onCategoryEdit: (category: CategoryFull) => void;
  onCategoryDelete: (id: number) => void;
};

export const CategoriesTabel = ({
  searchValue,
  categories,
  checkedCategories,
  onCheckedChange,
  onAllCheckedChange,
  onCategoryEdit,
  onCategoryDelete,
}: DataTabelProps) => {
  return (
    <Table>
      {/* Показывать, если пустой список категорий */}
      {categories.length === 0 && (
        <TableCaption>
          Не найдено категорий по запросу "{searchValue}"
        </TableCaption>
      )}

      {/* Header таблицы */}
      <TableHeader className="sticky top-0 right-0 left-0 z-2">
        <TableRow className="bg-primary **:text-white!">
          <TableHead className="dark sticky left-0 w-9 max-w-9 min-w-9 bg-inherit">
            <Checkbox
              className="mx-auto"
              checked={
                categories.length > 0 &&
                categories.every(({ id }) => checkedCategories.has(id))
              }
              onCheckedChange={onAllCheckedChange}
            />
          </TableHead>

          {tableCols.map((col) => (
            <TableHead
              key={col.value}
              className={cn(col.value === "image" ? "w-15 min-w-12.5" : "")}
            >
              {col.value === "image" ? (
                <ImageIcon size="18" className="mx-auto" />
              ) : (
                col.label
              )}
            </TableHead>
          ))}

          <TableHead className="sticky right-0 w-9 max-w-9 min-w-9 bg-inherit"></TableHead>
        </TableRow>
      </TableHeader>

      {/* Body таблицы */}
      <TableBody>
        {categories.map((category) => (
          <CategoriesTableItem
            key={category.id}
            category={category}
            checked={checkedCategories.has(category.id)}
            onCheckedChange={(checked) => onCheckedChange(checked, category.id)}
            onEdit={onCategoryEdit}
            onDelete={onCategoryDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
};
