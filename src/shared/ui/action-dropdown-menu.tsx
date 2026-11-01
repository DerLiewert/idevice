import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { MoreHorizontalIcon } from "lucide-react";
import { ReactElement } from "react";

interface ActionDropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  // children?: ReactElement<Parameters<typeof DropdownMenuTrigger>[0]>;
}

export const ActionDropdownMenu = ({
  onEdit,
  onDelete,
}: ActionDropdownMenuProps) => {
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
        <DropdownMenuItem onClick={onEdit}>Редактировать</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
