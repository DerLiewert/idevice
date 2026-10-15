"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, ImageOffIcon, Trash2Icon } from "lucide-react";
import { cn } from "cn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import { EditCategoryDialog } from "./edit-category-dialog";
import { ActionDropdownMenu } from "./action-dropdown-menu";
import { Search } from "./search";
import { CategoryFull, useSearchStore } from "../model";
import { deleteCategories, deleteCategory } from "../api";

const cols: { value: keyof CategoryFull; label: string }[] = [
  { value: "image", label: "Изображение" },
  { value: "name", label: "Название" },
  { value: "slug", label: "Ярлык" },
];

type DataViewerProps = {
  className?: string;
  categories: CategoryFull[];
};

export const DataViewer = ({ className, categories }: DataViewerProps) => {
  const router = useRouter();
  const { value: searchValue } = useSearchStore();
  const [checkedCategories, setCheckedCategories] = useState<Set<number>>(
    new Set(),
  );
  const [editableCategory, setEdditableCategory] =
    useState<CategoryFull | null>(null);
  const [open, setOpen] = useState(false);

  const searchCategories = searchValue
    ? categories.filter((category) =>
        category.name
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()),
      )
    : categories;

  const handleCheckedChange = (checked: boolean, id: number) => {
    if (checked) {
      setCheckedCategories((prev) => new Set([...prev, id]));
    } else {
      const prev = checkedCategories;
      prev.delete(id);
      setCheckedCategories(new Set(prev));
    }
  };

  const handleAllCheckedChange = (checked: boolean) => {
    if (checked) {
      setCheckedCategories(new Set(categories.map((category) => category.id)));
    } else {
      setCheckedCategories(new Set());
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Search />

      <div className="flex max-h-100 border">
        <Table>
          {/* Показывать, если пустой список категорий */}
          {searchCategories.length === 0 && (
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
                  checked={checkedCategories.size === categories.length}
                  onCheckedChange={handleAllCheckedChange}
                />
              </TableHead>

              {cols.map((col) => (
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
            {searchCategories.map((category) => (
              <TableRow
                key={category.id}
                className="bg-background even:bg-green-200"
              >
                <TableCell className="sticky left-0 bg-inherit">
                  <Checkbox
                    className="mx-auto"
                    name={`category_${category.id}`}
                    checked={checkedCategories.has(category.id)}
                    onCheckedChange={(checked) =>
                      handleCheckedChange(checked, category.id)
                    }
                  />
                </TableCell>

                {cols.map((col) => {
                  const image =
                    col.value === "image" ? category[col.value] : null;

                  return (
                    <TableCell key={col.value}>
                      {col.value === "image" ? (
                        image ? (
                          <Image
                            src={image.src || "/"}
                            alt={
                              image.alt ||
                              "Изображение категории " + category.name
                            }
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
                        )
                      ) : (
                        category[col.value]
                      )}
                    </TableCell>
                  );
                })}

                <TableCell className="sticky right-0 bg-inherit">
                  <ActionDropdownMenu
                    onEdit={() => setEdditableCategory(category)}
                    onDelete={async () => {
                      await deleteCategory(category.id);
                      router.refresh();
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-end">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="destructive"
                disabled={checkedCategories.size === 0}
              >
                Удалить все выбранные категории
              </Button>
            }
          />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>
                Удалить все выбранные категории?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Категории будут удалены, а товары, пренадлежащие этим
                категориям, переместятся в категорию - «Без категории»
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Отменить</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={async () => {
                  setOpen(false);
                  await deleteCategories(Array.from(checkedCategories));
                  setCheckedCategories(new Set());
                  router.refresh();
                }}
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Модальное окно для редактирования категории */}
      <EditCategoryDialog
        item={editableCategory}
        onClose={() => setEdditableCategory(null)}
        onSuccess={() => setEdditableCategory(null)}
      />
    </div>
  );
};
