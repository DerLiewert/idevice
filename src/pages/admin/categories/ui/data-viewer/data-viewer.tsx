"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { Button, SearchInput, toast } from "@/shared/ui";
import { CategoryFull, deleteCategories, deleteCategory } from "@/entities/categories";
import { EditCategoryDialog } from "../edit-category-dialog";
import { DeleteCategoriesDialog } from "./delete-categories-dialog";
import { CategoriesTabel } from "./categories-table";

type DataViewerProps = {
  className?: string;
  categories: CategoryFull[];
};

export const DataViewer = ({ className, categories }: DataViewerProps) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [deletedCategory, setDeletedCategory] = useState<number | null>(null);
  const [checkedCategories, setCheckedCategories] = useState<Set<number>>(
    new Set(),
  );
  const [editableCategory, setEdditableCategory] =
    useState<CategoryFull | null>(null);

  const searchCategories = searchValue
    ? categories.filter((category) =>
        category.name
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()),
      )
    : categories;
  const visibleChecked = searchCategories.filter(({ id }) =>
    checkedCategories.has(id),
  );

  const removeCheckedCategories = (ids: number[]) => {
    setCheckedCategories((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  };

  const handleCheckedChange = (checked: boolean, id: number) => {
    if (checked) {
      setCheckedCategories((prev) => new Set([...prev, id]));
    } else {
      removeCheckedCategories([id]);
    }
  };

  const handleAllCheckedChange = (checked: boolean) => {
    setCheckedCategories((prev) => {
      const next = new Set(prev);

      searchCategories.forEach(({ id }) =>
        checked ? next.add(id) : next.delete(id),
      );

      return next;
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <SearchInput value={searchValue} onChange={setSearchValue} />

      <div className="flex max-h-100 border">
        <CategoriesTabel
          searchValue={searchValue}
          categories={searchCategories}
          checkedCategories={checkedCategories}
          onCheckedChange={handleCheckedChange}
          onAllCheckedChange={handleAllCheckedChange}
          onCategoryEdit={setEdditableCategory}
          onCategoryDelete={(id) => {
            setOpenAlertDialog(true);
            setDeletedCategory(id);
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* <p className="text-muted-foreground">Выбрано: {checkedCategories.size} / {categories.length}</p> */}
        <p className="text-muted-foreground">
          Выбрано: {visibleChecked.length} / {searchCategories.length}
        </p>
        <Button
          type="button"
          variant="destructive"
          disabled={visibleChecked.length === 0}
          onClick={(e) => {
            e.preventDefault();
            setDeletedCategory(null);
            setOpenAlertDialog(true);
          }}
        >
          Удалить выбранные категории
        </Button>
      </div>

      {/* Модальное окно для подтверждения удаления категории(ий) */}
      <DeleteCategoriesDialog
        single={deletedCategory !== null}
        open={openAlertDialog}
        onOpenChange={setOpenAlertDialog}
        onDelete={async () => {
          let successToastText = null;

          if (deletedCategory !== null) {
            await deleteCategory(deletedCategory);

            removeCheckedCategories([deletedCategory]);
            setDeletedCategory(null);

            successToastText = "Категория успешно удалена";
          } else {
            const idsToDelete = visibleChecked.map(({ id }) => id);

            await deleteCategories(idsToDelete);
            removeCheckedCategories(idsToDelete);

            successToastText = "Категории успешно удалены";
          }

          toast.add({
            type: "success",
            description: successToastText,
          });

          setOpenAlertDialog(false);
          router.refresh();
        }}
      />

      {/* Модальное окно для редактирования категории */}
      <EditCategoryDialog
        item={editableCategory}
        onClose={() => setEdditableCategory(null)}
        onSuccess={() => setEdditableCategory(null)}
      />
    </div>
  );
};
