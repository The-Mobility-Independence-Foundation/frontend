"use client"

import { useEffect, useState } from "react";
import { Inventory, InventoryData } from "../models/Inventory";
import backendService from "../services/backend.service";
import { testInventory } from "../testData/TestInventoryData";
import Modal from "../components/modals/Modal";
import EditInventoryModal from "../components/modals/EditInventory";
import CreateInventoryModal from "../components/modals/CreateInventory";

// TODO: set up ellipsis drop down component
// TODO: connect with create inventory modal
// TODO: connect with edit inventory modal
export default function Inventories() {
  const [inventories, setInventories] = useState<InventoryData[]>([]);
  const [editInventoryIsOpen, setEditInventoryIsOpen] = useState(false);
  const [createInventoryIsOpen, setCreateInventoryIsOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryData>();

  const organizationID = 1; // TODO: fetch ORG ID

  useEffect(() => {
    // TODO: uncomment when backend is hooked up
    // backendService.get(`organizations/${organizationID}/inventories`)
    //   .then(response => {
    //     setInventories(response.results as Inventory[]);
    //   })
    setInventories(testInventory.data.results)
  }, [organizationID]);

  return <>
    <div className="px-[1rem] py-[2rem]">
      {inventories.map((inventory, index) => 
        <div
          key={inventory.id}
          className={`flex justify-between mb-[0.5rem] px-[0.75rem] py-[1rem] rounded min-h-[6.25rem] drop-shadow-sm ${index % 2 == 0 ? "bg-[#034FA7]" : "bg-[#002856]"}`}
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
    {selectedInventory && 
    <Modal
      isOpen={editInventoryIsOpen}
      onClose={() => setEditInventoryIsOpen(false)}
    >
      <EditInventoryModal
        organizationID={organizationID}
        inventoryData={selectedInventory}
        onClose={() => setEditInventoryIsOpen(false)}
        />
    </Modal>
    }
    <Modal
      isOpen={createInventoryIsOpen}
      onClose={() => setCreateInventoryIsOpen(false)}
    >
      <CreateInventoryModal
        organizationID={organizationID}
        onClose={() => setCreateInventoryIsOpen(false)}
        />
    </Modal>
  </>
}