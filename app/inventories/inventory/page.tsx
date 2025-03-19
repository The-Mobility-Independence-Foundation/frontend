"use client"

import Search from "@/app/components/Search";
import { InventoryData } from "@/app/models/Inventory";
import { InventoryItemData } from "@/app/models/InventoryItem";
import backendService from "@/app/services/backend.service";
import { testInventory, testInventoryData1 } from "@/app/testData/TestInventoryData";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryData>();
  const [inventoryItems, setInventoryItems] = useState<InventoryItemData[]>();
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
    setInventoryItems(data.results as InventoryItemData[]);
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
        </div>
      )}
    </>;
}