import { Checkbox } from "@/components/ui/checkbox";
import { DisplayedInventoryItem } from "../inventories/inventory/page"
import { CheckedState } from "@radix-ui/react-checkbox";
import Link from "next/link";
import Menu from "./Menu";
import { useEffect, useState } from "react";

interface InventoryItemProps {
  inventoryItem: DisplayedInventoryItem
  onCheckboxChange: (checked: CheckedState) => void;
  className?: string
}

const EDIT = "Edit";
const DELETE = "Delete";

export default function InventoryItem({inventoryItem, onCheckboxChange, className}: InventoryItemProps) {  
  const userID = 1; // TODO: grab user id
  const menuItems = [EDIT, DELETE];
  
  const onMenuItemClick = (item: string) => {
    switch(item) {
      case EDIT:
        // TODO: open edit inventry item modal
        break;
      case DELETE:
        // TODO: open dialogue
        break;
    }
  }

  return <div
    className={`flex justify-between w-full bg-[#F4F4F5] min-h-[11rem] drop-shadow-md rounded-sm px-[1rem] py-[0.75rem] 
      flex-wrap
      max-sm:pl-[2rem] ${className}`}
    >
      <div
        className="flex w-full
                  max-sm:flex-col"
      >
        <Checkbox
          className="bg-white w-[1.5rem] h-[1.5rem]"
          onCheckedChange={(checked) => onCheckboxChange(checked)}
          checked={inventoryItem.checked}
        />
      <div className="flex max-sm:mt-[1rem] ml-[1.5rem]">
        <div>
          <h4>{inventoryItem.name} ({inventoryItem.quantity})</h4>
          <h5>{inventoryItem.part.partNumber}</h5>
          <p className="mt-[revert]">{inventoryItem.part.model}</p>
          <p>{inventoryItem.part.partType}</p>
        </div>
        <ul className="ml-[3rem] mr-[1rem] max-h-[10rem] min-w-[15rem] overflow-y-auto">
          <li className="mb-[0.25rem]">{inventoryItem.attributes}</li>
          <li>{inventoryItem.notes}</li>
        </ul>
      </div>
      <div className="flex flex-col justify-between items-center">
        <span className="flex items-center h-min mt-[1rem]"><p className="mr-[0.5rem]">Quantity Listed: </p><h5>{inventoryItem.publicCount}</h5></span>
        <Link href={`/listings?u_id=${userID}`}>
          <p className="text-[#00A028] italic underline">View Listings</p>
        </Link>
      </div>
    </div>
    {!inventoryItem.inventory.archived && <Menu 
      items={menuItems}
      onItemClick={onMenuItemClick}
      className="absolute right-2.5"
    />}
  </div>
}