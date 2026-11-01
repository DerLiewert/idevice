import { SpecificationGroup } from "@/entities/specifications-groups";
import { Dialog, DialogContent } from "@/shared/ui";
import { FormSpecificationGroup } from "./form-group";

type EditGroupDialog = {
  item: SpecificationGroup | null;
  onClose: () => void;
};

export const EditGroupDialog = ({ item, onClose }: EditGroupDialog) => {
  return (
    <Dialog
      open={item !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        {item && (
          <FormSpecificationGroup
            role="edit"
            onSuccess={onClose}
            defaultValues={item}
            group_id={item.id}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
