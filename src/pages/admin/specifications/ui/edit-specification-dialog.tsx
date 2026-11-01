import { Dialog, DialogContent } from "@/shared/ui";
import { FormSpecification } from "./form-specification";
import { SpecificationResponse } from "@/entities/specifications";
import { SpecificationGroup } from "@/entities/specifications-groups";

type EditGroupDialog = {
  onClose: () => void;
  item: SpecificationResponse | null;
  groups: SpecificationGroup[];
};

export const EditSpecificationDialog = ({
  item,
  onClose,
  groups,
}: EditGroupDialog) => {
  return (
    <Dialog
      open={item !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        {item && (
          <FormSpecification
            role="edit"
            onSuccess={onClose}
            defaultValues={{ name: item.name, group_id: item.group.id }}
            specification_id={item.id}
            groups={groups}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
