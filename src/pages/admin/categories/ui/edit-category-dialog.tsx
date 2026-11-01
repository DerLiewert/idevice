import { DialogContent, DialogHeader, Dialog, DialogTitle } from "@/shared/ui";
import { CategoryForm } from "./category-form";
import { toFormDefaults } from "@/entities/categories/api/mappers";
import { CategoryFull } from "@/entities/categories";

interface EditCategoryDialogProps {
  item: CategoryFull | null;
  onClose: () => void;
  onSuccess?: () => void
}

export const EditCategoryDialog = ({
  item,
  onClose,onSuccess
}: EditCategoryDialogProps) => {
  return (
    <Dialog
      open={item !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">
            Редактирование категории
          </DialogTitle>
        </DialogHeader>
        {item && (
          <CategoryForm
            role="edit"
            id={item.id}
            defaultValues={toFormDefaults(item)}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
