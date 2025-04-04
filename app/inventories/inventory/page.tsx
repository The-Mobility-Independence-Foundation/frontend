"use client"

import Search from "@/app/components/Search";
import { InventoryItemData, InventoryItems } from "@/app/models/InventoryItem";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react";
import InventoryItem from "@/app/components/InventoryItem";
import Modal from "@/app/components/modals/Modal";
import CreateInventoryItem from "@/app/components/modals/CreateInventoryItem";
import { userEmitter } from "@/app/layout";
import { UserData } from "@/app/models/User";
import KeysetPagination from "@/app/components/KeysetPagination";
import { toast } from "sonner";

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItems>();
  const [inventoryItemsDisplaying, setInventoryItemsDisplaying] = useState<InventoryItemData[]>([]);
  const [newItemModalIsOpen, setNewItemModalIsOpen] = useState(false);
  const [orgID, setOrgID] = useState("");
  const [userID, setUserID] = useState("");

  const params = useSearchParams();
  const inventoryID = params.get("inventoryID");
  const router = useRouter();

  useEffect(() => {
    userEmitter.on("user", (userEmitted: UserData) => {
      if(userEmitted.organization) {
        setOrgID(userEmitted.organization.id);
      } else {
        toast("Must be connected to an organization to access this inventory.");
        router.push("/listings");
      }
      setUserID(userEmitted.id);
    })
  })

  const receiveInventoryItems = useCallback((data: object) => {
    const inventoryItemData = data as InventoryItems;
    setInventoryItemsDisplaying(inventoryItemData.data.results.map(item => {
      return {
      id: item.id,
      name: item.name,
      inventory: item.inventory,
      part: item.part,
      model: item.model,
      quantity: item.quantity,
      publicCount: item.publicCount,
      notes: item.notes,
      attributes: item.attributes,
      checked: false
    }}));
    setInventoryItems(inventoryItemData);
  }, []);

  return <>
    {orgID != "" && inventoryID && <>
    <div className="flex flex-col">
      {inventoryItems && inventoryItems?.data.results.length > 0 && (
        <div className="w-full bg-[#F4F4F5] p-[1rem]">
          <h2>{inventoryItems.data.results[0].inventory?.name}</h2>
        </div>
      )}
      <Search
        apiRoute={`/organizations/${orgID}/inventories/${inventoryID}/items`}
        searchBy={"name"}
        receiveResponse={receiveInventoryItems}
        placeholderText="Search Inventory Items"
        newButtonEvent={() => setNewItemModalIsOpen(true)}
        filterType={FilterComponentType.INVENTORY_ITEMS} />
      {inventoryItems && inventoryItems?.data.results.length > 0 && (
        <>
          <div className="px-[1rem] pt-[1.25rem] h-[60vh] min-h-0 overflow-y-auto">
            {inventoryItemsDisplaying.map(item => 
            <InventoryItem
              inventoryItem={item}
              userID={userID}
              key={item.id}
              className="mb-[1rem] mx-auto" />
            )}
          </div>
          <KeysetPagination 
            hasNextPage={inventoryItems.data.hasNextPage}
            hasPreviousPage={inventoryItems.data.hasPreviousPage}
            nextCursor={inventoryItems.data.nextCursor}
            previousCursor={inventoryItems.data.previousCursor}
          />
        </>
      )}
    </div>
    <Modal
      isOpen={newItemModalIsOpen}
      onClose={() => setNewItemModalIsOpen(false)}
    >
      <CreateInventoryItem
        onClose={() => setNewItemModalIsOpen(false)}
        organizationID={orgID}
        inventoryID={inventoryID} />
    </Modal>
    </>}
  </> 
}