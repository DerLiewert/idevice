import { Trash2Icon } from "lucide-react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialog,
} from "@/shared/ui";

export type DeleteCategoriesDialogProps = {
  single: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void | Promise<void>;
};

export const DeleteCategoriesDialog = ({
  single,
  open,
  onOpenChange,
  onDelete,
}: DeleteCategoriesDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {single ? "Удалить категорию?" : "Удалить все выбранные категории?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {single
              ? "Категория будет удалена, а товары, пренадлежащие ей, переместятся в категорию - «Без категории»"
              : "Категории будут удалены, а товары, пренадлежащие этим категориям, переместятся в категорию - «Без категории»"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Отменить</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => onDelete()}>
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
