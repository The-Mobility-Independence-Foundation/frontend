"use client"

import Search from "@/app/components/Search";
import { InventoryItemData, InventoryItems } from "@/app/models/InventoryItem";
import backendService from "@/app/services/backend.service";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import Pagination from "@/app/components/Pagination";
import InventoryItem from "@/app/components/InventoryItem";
import { CheckedState } from "@radix-ui/react-checkbox";

export interface DisplayedInventoryItem extends InventoryItemData {
  checked: CheckedState
}

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItems>();
  const [inventoryItemsDisplaying, setInventoryItemsDisplaying] = useState<DisplayedInventoryItem[]>([]);
  const [newItemModalIsOpen, setNewItemModalIsOpen] = useState(false);

  const params = useSearchParams();
  const orgID = params.get("org_id");
  const inventoryID = params.get("inventory_id");

  const receiveInventoryItems = (data: any) => {
    const inventoryItemData = data as InventoryItems;
    setInventoryItemsDisplaying(inventoryItemData.data.results.map(item => {
      return {
      id: item.id,
      name: item.name,
      inventory: item.inventory,
      part: item.part,
      modelID: item.modelID,
      quantity: item.quantity,
      publicCount: item.publicCount,
      notes: item.notes,
      attributes: item.attributes,
      checked: false
    }}));
    setInventoryItems(inventoryItemData);
  }

  const toggleCheckAllItems = (checked: any) => {
    inventoryItemsDisplaying.forEach(item => item.checked = typeof checked === "boolean" && checked);
    setInventoryItemsDisplaying(inventoryItemsDisplaying);
  }

  const toggleInventoryItemCheck = (checked: CheckedState, inventoryItemID: number) => {
    for(let item of inventoryItemsDisplaying) {
      if(item.id == inventoryItemID) {
        item.checked = checked;
        break;
      }
    }
    console.log(inventoryItemsDisplaying)
    setInventoryItemsDisplaying(inventoryItemsDisplaying);
  }

  return (
    <div className="flex flex-col">
      {inventoryItems && inventoryItems?.data.results.length > 0 && (
        <div className="w-full bg-[#F4F4F5] p-[1rem]">
          <h2>{inventoryItems.data.results[0].inventory.name}</h2>
        </div>
      )}
      <Search
        apiRoute={`/organizations/${orgID}/inventories/${inventoryID}/items`}
        receiveData={receiveInventoryItems}
        placeholderText="Search Inventory Items"
        newButtonEvent={() => setNewItemModalIsOpen(true)}
        filterType={FilterComponentType.INVENTORY_ITEMS}
      />
      {inventoryItems && inventoryItems?.data.results.length > 0 && (
        <>
          <div className="w-full bg-[#F4F4F5] p-[1rem] flex items-center">
            <Checkbox
              className="bg-white w-[1.5rem] h-[1.5rem]"
              onCheckedChange={(checked) => toggleCheckAllItems(checked)}
            />
            <button className="button !bg-[#FF6C6C] ml-[4rem]">
              Delete Selected
            </button>
          </div>
          <div className="px-[1rem] pt-[1.25rem] h-[60vh] min-h-0 overflow-y-auto">
            {inventoryItemsDisplaying.map(item => 
              <InventoryItem 
                inventoryItem={item}
                key={item.id}
                className="mb-[1rem] mx-auto"
                onCheckboxChange={(checked) => toggleInventoryItemCheck(checked, item.id)}
              />
            )}
          </div>
          <Pagination
            count={inventoryItems.data.count}
            totalCount={inventoryItems.data.totalCount}
            hasNext={inventoryItems.data.hasNext}
            nextToken={inventoryItems.data.nextToken}
          />
        </>
      )}
    </div>
  );
}