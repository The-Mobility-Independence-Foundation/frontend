import Link from "next/link";
import Menu from "./Menu";
import { useState } from "react";
import Modal from "./modals/Modal";
import {
  attributesToString,
  InventoryItemData,
  InventoryItemsDelete,
} from "../models/InventoryItem";
import EditInventoryItem from "./modals/EditInventoryItem";
import Dialog from "./modals/Dialog";
import backendService from "../services/backend.service";
import { toast } from "sonner";
import { toastErrors } from "../models/Generic";

interface InventoryItemProps {
  inventoryItem: InventoryItemData;
  userID: number | string;
  triggerRefresh: () => void;
  className?: string;
}

const EDIT = "Edit";
const ARCHIVE = "Archive";

export default function InventoryItem({
  inventoryItem,
  userID,
  className,
  triggerRefresh,
}: InventoryItemProps) {
  const [editItemModalIsOpen, setEditItemModalIsOpen] = useState(false);
  const [archiveItemDialogIsOpen, setArchiveItemDialogIsOpen] = useState(false);

  const menuItems = [EDIT, ARCHIVE];
  const attributesAsString = attributesToString(inventoryItem.attributes);

  const onMenuItemClick = (item: string) => {
    switch (item) {
      case EDIT:
        setEditItemModalIsOpen(true);
        break;
      case ARCHIVE:
        setArchiveItemDialogIsOpen(true);
        break;
    }
  };

  const onEditItemClose = (submitted: boolean) => {
    setEditItemModalIsOpen(false);
    if (submitted) {
      triggerRefresh();
    }
  };

  const onArchiveItemClose = (confirm: boolean) => {
    if (!inventoryItem.inventory) {
      toast(
        "There was an error grabbing the inventory associated with this inventory item."
      );
      return;
    }
    setArchiveItemDialogIsOpen(false);
    if (confirm) {
      backendService
        .delete(
          `/organizations/${inventoryItem.inventory.organization.id}/inventories/${inventoryItem.inventory.id}/items/${inventoryItem.id}`
        )
        .then((response) => {
          const responseAsInventoryItems = response as InventoryItemsDelete;
          if (!responseAsInventoryItems.success) {
            toastErrors(response);
            return;
          }
          toast(responseAsInventoryItems.message);
          setArchiveItemDialogIsOpen(false);
          triggerRefresh();
        });
    }
  };

  return (
    <div
      className={`flex justify-between w-full bg-[#F4F4F5] min-h-[11rem] drop-shadow-md rounded-sm px-[1rem] py-[0.75rem] 
      ${className}`}
    >
      <div
        className="flex flex-wrap w-full"
      >
        <div className="flex">
          <div className="w-64">
            <div className="flex items-start">
              <h4>
                {inventoryItem.part?.name} ({inventoryItem.quantity})
              </h4>
              {inventoryItem.archivedAt && (
                <span className="text-white p-[0.2rem] border border-white rounded bg-[#fb5555] font-bold ml-[1rem] mt-[0.75rem]">
                  Archived
                </span>
              )}
            </div>
            {inventoryItem.part?.partNumber && (
              <h5>#{inventoryItem.part.partNumber}</h5>
            )}
            <p className="mt-[revert]">{inventoryItem.part?.model?.name}</p>
          </div>
          <ul className="ml-[2rem] mr-[1rem] max-h-[10rem] w-[8rem] overflow-y-auto">
            <li className="mb-[0.25rem]">{attributesAsString}</li>
            <li>{inventoryItem.notes}</li>
          </ul>
        </div>
        <div className="flex flex-col justify-between items-center">
          <span className="flex items-center h-min mt-[1rem]">
            <p className="mr-[0.5rem]">Quantity Listed: </p>
            <h5>{inventoryItem.publicCount}</h5>
          </span>
          <Link href={`/my-listings`}>
            <p className="text-[#00A028] italic underline">View Listings</p>
          </Link>
        </div>
      </div>
      {inventoryItem.inventory && !inventoryItem.inventory.archivedAt && (
        <Menu
          items={menuItems}
          onItemClick={onMenuItemClick}
          className="absolute right-2.5"
        />
      )}

      <Modal
        isOpen={editItemModalIsOpen}
        onClose={() => onEditItemClose(false)}
      >
        <EditInventoryItem
          onClose={onEditItemClose}
          inventoryItem={inventoryItem}
        />
      </Modal>
      <Modal
        isOpen={archiveItemDialogIsOpen}
        onClose={() => onArchiveItemClose(false)}
      >
        <Dialog
          text="Are you sure you would like to archive this inventory item?"
          onClose={onArchiveItemClose}
          header={`Archive ${inventoryItem.part?.name}?`}
        />
      </Modal>
    </div>
  );
}
