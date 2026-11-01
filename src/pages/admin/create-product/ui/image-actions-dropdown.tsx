import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Button,
} from "@/shared/ui";
import { MoreHorizontalIcon, RefreshCcwIcon, TrashIcon } from "lucide-react";

type DropdownImageActionsProps = {
  onReplace: () => void;
  onDelete: () => void;
};

export const ImageActionsDropdown = ({
  onReplace,
  onDelete,
}: DropdownImageActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="ml-auto"
        render={
          <Button variant="ghost" size="icon" className="group/btn size-8">
            <MoreHorizontalIcon />
            <span className="sr-only">Открыть меню действий</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onReplace}>
          <RefreshCcwIcon /> Заменить
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <TrashIcon /> Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
