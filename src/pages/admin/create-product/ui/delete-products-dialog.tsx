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

export type DeleteProductsDialogProps = {
  single: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void | Promise<void>;
};

export const DeleteProductsDialog = ({
  single,
  open,
  onOpenChange,
  onDelete,
}: DeleteProductsDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {single ? "Удалить товар?" : "Удалить все выбранные товары?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {single
              ? "Товар будет удален вместе со всеми его вариантами"
              : "Товары будет удалены вместе со всеми их вариантами"}
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
