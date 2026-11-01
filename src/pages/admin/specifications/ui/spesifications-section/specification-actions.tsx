"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSpecifications } from "@/entities/specifications";
import { deleteSpecificationsGroups } from "@/entities/specifications-groups";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { useCheckedStore } from "../../model/checked-store";

const actionOptions = [
  { value: "delete-groups", label: "Удалить выбранные группы" },
  { value: "delete-specifications", label: "Удалить выбранные характеристики" },
] as const;

type ActionValue = (typeof actionOptions)[number]["value"];

export const SpecificationActions = () => {
  const router = useRouter();
  const { groups, specifications, clearChecked } = useCheckedStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionValue>(
    actionOptions[0].value,
  );

  const isDisabledBtn =
    selectedAction === "delete-groups"
      ? groups.size === 0
      : specifications.size === 0;

  const handleAction = async () => {
    switch (selectedAction) {
      case "delete-groups":
        await deleteSpecificationsGroups(Array.from(groups));
        clearChecked("groups");
        break;
      case "delete-specifications":
        await deleteSpecifications(Array.from(specifications));
        clearChecked("specifications");
        break;
    }

    setIsDialogOpen(false);
    router.refresh();
  };

  return (
    <>
      <div>
        <Field>
          <div className="mb-1 flex items-center gap-2">
            <FieldLabel>Действие</FieldLabel>
            <Select
              items={actionOptions}
              value={selectedAction}
              onValueChange={(val) => {
                setSelectedAction(val ?? actionOptions[0].value);
              }}
            >
              <SelectTrigger className="w-100 min-w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {actionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <FieldDescription>
            Выберите, что нужно сделать с выбранными характеристиками / группами
            характеристик
          </FieldDescription>
        </Field>

        <Button
          className="mt-4 min-w-60"
          onClick={() => setIsDialogOpen(true)}
          disabled={isDisabledBtn}
        >
          {isDisabledBtn
            ? "Ничего не выбрано для удаления"
            : "Подтвердить действие"}
        </Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => !open && setIsDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-2xl!">
          <DialogHeader>
            <DialogTitle>
              Вы действительно хотите удалить выбранные{" "}
              <span className="text-accent font-medium">
                {selectedAction === "delete-groups"
                  ? " группы характик"
                  : "характеристики"}
              </span>{" "}
              ?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Отменить
                </Button>
              }
            />
            <Button onClick={handleAction}>Подтвердить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
