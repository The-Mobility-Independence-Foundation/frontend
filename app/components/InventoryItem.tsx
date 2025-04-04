import Link from "next/link";
import Menu from "./Menu";
import { useState } from "react";
import Modal from "./modals/Modal";
import { attributesToString, InventoryItemData } from "../models/InventoryItem";
import EditInventoryItem from "./modals/EditInventoryItem";

interface InventoryItemProps {
  inventoryItem: InventoryItemData;
  userID: number | string;
  className?: string;
}

const EDIT = "Edit";
const DELETE = "Delete";

export default function InventoryItem({inventoryItem, userID, className}: InventoryItemProps) {  
  const [editItemModalIsOpen, setEditItemModalIsOpen] = useState(false);

  const menuItems = [EDIT, DELETE];
  const attributesAsString = attributesToString(inventoryItem.attributes);
  
  const onMenuItemClick = (item: string) => {
    switch(item) {
      case EDIT:
        setEditItemModalIsOpen(true);
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
      <div className="flex max-sm:mt-[1rem] ml-[1.5rem]">
        <div>
          <h4>{inventoryItem.name} ({inventoryItem.quantity})</h4>
          <h5>{inventoryItem.part?.partNumber}</h5>
          <p className="mt-[revert]">{inventoryItem.part?.model}</p>
          <p>{inventoryItem.part?.partType}</p>
        </div>
        <ul className="ml-[3rem] mr-[1rem] max-h-[10rem] min-w-[15rem] overflow-y-auto">
          <li className="mb-[0.25rem]">{attributesAsString}</li>
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
    {inventoryItem.inventory && !inventoryItem.inventory.archivedAt && 
    <Menu 
      items={menuItems}
      onItemClick={onMenuItemClick}
      className="absolute right-2.5"
    />
    }

    <Modal
      isOpen={editItemModalIsOpen}
      onClose={() => setEditItemModalIsOpen(false)}
    >
      <EditInventoryItem 
        onClose={() => setEditItemModalIsOpen(false)}
        inventoryItem={inventoryItem}
      />
    </Modal>
  </div>
}