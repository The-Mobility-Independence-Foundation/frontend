import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createHash } from "crypto";

interface MenuProps {
  items: string[];
  onItemClick: (itemClicked: string) => void;
  onOpenChange?: (open: boolean) => void
  triggerText?: string;
  className?: string;
}

export default function Menu({items, onItemClick, onOpenChange, triggerText, className}: MenuProps) {
  return (
    <div className={`${className}`}>
      <DropdownMenu onOpenChange={open => {if(onOpenChange)onOpenChange(open)}}>
        <DropdownMenuTrigger>{triggerText || "•••"}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {items.map((item) => (
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => onItemClick(item)}
                key={createHash("sha256").update(item).digest("hex")}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
