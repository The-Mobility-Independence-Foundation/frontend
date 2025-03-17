import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuProps {
  isOpen: boolean;
  items: string[];
  onClose: (itemClicked: string | null) => void;
  triggerText?: string;
  className?: string;
}

export default function Menu({isOpen, items, onClose, triggerText, className}: MenuProps) {
  return <>
      {isOpen && (
        <div className={`${className}`}>
          <DropdownMenu>
            <DropdownMenuTrigger>{triggerText || "..."}</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {items.map((item) => (
                  <DropdownMenuItem onClick={() => onClose(item)}>
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
}
