"use client"

import Search from "@/app/components/Search";
import { InventoryData } from "@/app/models/Inventory";
import { InventoryItemData } from "@/app/models/InventoryItem";
import backendService from "@/app/services/backend.service";
import { testInventory, testInventoryData1 } from "@/app/testData/TestInventoryData";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"

interface DisplayedInventoryItem extends InventoryItemData {
  checked: boolean
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryData>();
  const [inventoryItems, setInventoryItems] = useState<DisplayedInventoryItem[]>([]);
  const [newItemModalIsOpen, setNewItemModalIsOpen] = useState(false);

  const params = useSearchParams();
  const orgID = params.get("org_id");
  const inventoryID = params.get("inventory_id");

  useEffect(() => {
    if(orgID && inventoryID) {
      // TODO: uncomment when backend is hooked up
      // backendService.get(`organizations/${orgID}/inventories/${inventoryID}`)
      // .then(response => {
      //   setInventory(response.data as InventoryData);
      // });
      setInventory(testInventoryData1);
    }
  }, [orgID, inventoryID]);

  const receiveInventoryItems = (data: any) => {
    const inventoryItemResults = data.data.results as InventoryItemData[];
    setInventoryItems(inventoryItemResults.map(item => {
      return {
      id: item.id,
      name: item.name,
      inventoryID: item.inventoryID,
      partID: item.partID,
      modelID: item.modelID,
      quantity: item.quantity,
      publicCount: item.publicCount,
      notes: item.notes,
      attributes: item.attributes,
      checked: false
    }}));
  }

  const toggleCheckAllItems = (checked: any) => {
    inventoryItems.forEach(item => item.checked = typeof checked === "boolean" && checked);
    setInventoryItems(inventoryItems);
  }

  return <>
      {inventory && (
        <div className="flex flex-col">
          <div className="w-full bg-[#F4F4F5] p-[1rem]">
            <h2>{inventory.name}</h2>
          </div>
          <Search
            apiRoute={`/organizations/${orgID}/inventories/${inventoryID}/items`}
            receiveData={receiveInventoryItems}
            placeholderText="Search Inventory Items"
            newButtonEvent={() => setNewItemModalIsOpen(true)}
            filterType={FilterComponentType.INVENTORY_ITEMS}
          />
          <div className="w-full bg-[#F4F4F5] p-[1rem]">
            <Checkbox
              onCheckedChange={(checked) => toggleCheckAllItems(checked)}
            />
          </div>
        </div>
      )}
    </>;
}