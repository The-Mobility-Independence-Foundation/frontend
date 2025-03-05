"use client"

import { useEffect, useState } from "react";
import { Inventory, InventoryData } from "../models/Inventory";
import backendService from "../services/backend.service";
import { testInventory } from "../testData/TestInventoryData";

export default function Inventories() {
  const [inventories, setInventories] = useState<InventoryData[]>([]);

  const organizationID = 1; // TODO: fetch ORG ID

  useEffect(() => {
    // TODO: uncomment when backend is hooked up
    // backendService.get(`organizations/${organizationID}/inventories`)
    //   .then(response => {
    //     setInventories(response.results as Inventory[]);
    //   })
    setInventories(testInventory.data.results)
  }, [organizationID]);

  return <div className="px-[1rem] py-[2rem]">
    {inventories.map((inventory, index) => 
      <div
        key={inventory.id}
        className={`flex justify-between mb-[0.5rem] px-[0.75rem] py-[1rem] rounded min-h-[6.25rem] ${index % 2 == 0 ? "bg-[#034FA7]" : "bg-[#002856]"}`}
      >
        <h3 className="text-white">{inventory.name}</h3>
        <p className="text-white">{inventory.location}</p>
        <div>
          {/** TODO: change once fields have been established */}
          <p className="text-white">XX Different Parts</p>
          <p className="text-white">XXX Total Inventory</p>
        </div>
      </div>
    )}
  </div>
}