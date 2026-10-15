"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TabsContent, Checkbox } from "@/shared/ui";
import { ActionDropdownMenu } from "../action-dropdown-menu";
import { EditSpecificationDialog } from "../edit-specification-dialog";
import { deleteSpecification } from "../../api/specifications-api";
import {
  useSearchStore,
  SpecificationGroup,
  SpecificationResponse,
  ALL_SPECIFICATIONS_GROUP,
  useCheckedStore,
} from "../../model";

export const SpecificationsList = ({
  groups,
  specifications,
}: {
  groups: SpecificationGroup[];
  specifications: SpecificationResponse[];
}) => {
  const router = useRouter();
  const [editableItem, setEdditableItem] =
    useState<SpecificationResponse | null>(null);
  const searchStore = useSearchStore();
  const searchValue = searchStore.value.toLowerCase();
  const isSearching = searchStore.type === "specifications" && searchValue;

  const handleDelete = async (id: number) => {
    await deleteSpecification(id);
    router.refresh();
  };

  return (
    <>
      {[ALL_SPECIFICATIONS_GROUP, ...groups].map((group) => {
        const groupItems =
          group.id === ALL_SPECIFICATIONS_GROUP.id
            ? specifications
            : specifications.filter(
                (specification) => specification.group.id === group.id,
              );

        const searchedGroupItems = isSearching
          ? groupItems.filter((specification) =>
              specification.name.toLowerCase().includes(searchValue),
            )
          : groupItems;

        const isEmpty = searchedGroupItems.length === 0;

        return (
          <TabsContent className="h-full" key={group.id} value={group.id}>
            {isEmpty ? (
              <div className="flex h-full items-center justify-center text-center">
                {groupItems.length > 0
                  ? `Не найдено характеристик содержащих "${searchStore.value}"`
                  : `Пока не добавлено никаких характеристик ${group.id === ALL_SPECIFICATIONS_GROUP.id ? "для всех групп" : `для группы "${group.name}"`}`}
              </div>
            ) : (
              searchedGroupItems.map((obj) => (
                <SpecificationItem
                  key={obj.id}
                  item={obj}
                  showGroup={group.id === ALL_SPECIFICATIONS_GROUP.id}
                  onEdit={() => setEdditableItem(obj)}
                  onDelete={() => handleDelete(obj.id)}
                />
              ))
            )}
          </TabsContent>
        );
      })}
      <EditSpecificationDialog
        item={editableItem}
        groups={groups}
        onClose={() => setEdditableItem(null)}
      />
    </>
  );
};

//======== SpecificationItem ==========================
const SpecificationItem = ({
  item,
  showGroup = false,
  onEdit,
  onDelete,
}: {
  item: SpecificationResponse;
  showGroup?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { specifications, setChecked, setUnchecked } = useCheckedStore();
  const isChecked = specifications.has(item.id);

  const handleCheckedChange = () => {
    if (isChecked) {
      setUnchecked({
        entity: "specifications",
        id: item.id,
      });
    } else {
      setChecked({
        entity: "specifications",
        id: item.id,
      });
    }
  };

  return (
    <div className="group flex items-center gap-2.5 px-2.5 py-1.75 even:bg-green-200">
      <Checkbox
        value={item.id.toString()}
        onCheckedChange={handleCheckedChange}
        checked={specifications.has(item.id)}
      />
      {item.name}

      {showGroup && (
        <>
          {" "}
          <span className="opacity-40">({item.group.name})</span>
        </>
      )}

      <ActionDropdownMenu onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};
