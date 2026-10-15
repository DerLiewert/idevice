import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { MoreHorizontalIcon } from "lucide-react";

interface ActionDropdownMenu {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionDropdownMenu = ({
  onEdit,
  onDelete,
}: ActionDropdownMenu) => {
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
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
