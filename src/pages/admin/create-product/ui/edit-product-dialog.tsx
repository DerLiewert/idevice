import { DialogContent, DialogHeader, Dialog, DialogTitle } from "@/shared/ui";
import { Category, CategoryFull, ProductFull } from "../model";
import { ProductForm } from "./product-form";

interface EditProductDialogProps {
  item: ProductFull | null;
  categories: Category[];
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditProductDialog = ({
  item,
  categories,
  onClose,
  onSuccess,
}: EditProductDialogProps) => {
  return (
    <Dialog
      open={item !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Редактирование товара</DialogTitle>
        </DialogHeader>
        {item && (
          <ProductForm
            role="edit"
            id={item.id}
            categories={categories}
            defaultValues={{
              ...item,
              category_id: item.category.id,
              images: item.images.map((img) => ({
                type: "existing",
                ...img,
              })),
              description: item.description ?? "",
            }}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
