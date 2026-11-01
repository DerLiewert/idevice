"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontalIcon } from "lucide-react";
import {
  deleteSpecificationsGroup,
  SpecificationGroup,
} from "@/entities/specifications-groups";
import {
  TabsTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  TabsList,
  Button,
  Checkbox,
} from "@/shared/ui";
import { useSearchStore } from "../../model/search-store";
import { CheckedPayload, useCheckedStore } from "../../model/checked-store";
import { ALL_SPECIFICATIONS_GROUP } from "../../config/constants";
import { EditGroupDialog } from "../edit-group-dialog";

export const SpecificationsGroupsList = ({
  groups,
}: {
  groups: SpecificationGroup[];
}) => {
  const router = useRouter();
  const [focusedTab, setFocusedTab] = useState<number | null>(null);
  const [editableItem, setEditableItem] = useState<SpecificationGroup | null>(
    null,
  );

  const { searchValues } = useSearchStore();
  const searchValue = searchValues.groups.toLowerCase();
  const searchGroups = searchValue
    ? groups.filter((item) => item.name.toLowerCase().includes(searchValue))
    : groups;

  const { groups: groupsChecked, setUnchecked, setChecked } = useCheckedStore();

  const handleCheckedChange = (id: number, checked: boolean) => {
    const checkedPayload: CheckedPayload = { entity: "groups", id };

    if (checked) setChecked(checkedPayload);
    else setUnchecked(checkedPayload);
  };

  return (
    <>
      <TabsList className="w-full gap-0 p-0">
        {[ALL_SPECIFICATIONS_GROUP, ...searchGroups].map((item, i) => {
          return (
            <div className="group relative w-full" key={item.id}>
              <TabsTrigger
                value={item.id}
                className="min-h-9 max-w-full rounded-none px-10"
                onFocus={() => setFocusedTab(i)}
              >
                <span className="overflow-hidden" title={item.name}>
                  {item.name}
                </span>
              </TabsTrigger>

              {item.id !== ALL_SPECIFICATIONS_GROUP.id && (
                <Checkbox
                  className="absolute top-1/2 left-2 -translate-y-1/2"
                  value={item.id.toString()}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(item.id, checked)
                  }
                  checked={groupsChecked.has(item.id)}
                  tabIndex={focusedTab === i ? 0 : -1}
                />
              )}

              {item.id !== ALL_SPECIFICATIONS_GROUP.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                    onFocus={() => setFocusedTab(i)}
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        tabIndex={focusedTab === i ? 0 : -1}
                      >
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditableItem(item)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={async () => {
                        await deleteSpecificationsGroup(item.id);
                        router.refresh();
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </TabsList>
      <EditGroupDialog
        item={editableItem}
        onClose={() => setEditableItem(null)}
      />
    </>
  );
};
