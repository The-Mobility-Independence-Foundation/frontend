"use client"

import { useEffect, useState } from "react";
import { Inventory, InventoryData } from "../models/Inventory";
import backendService from "../services/backend.service";
import { testInventory } from "../testData/TestInventoryData";
import Modal from "../components/modals/Modal";
import EditInventoryModal from "../components/modals/EditInventory";
import CreateInventoryModal from "../components/modals/CreateInventory";
import Search from "../components/Search";
import Menu from "../components/Menu";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const EDIT = "Edit";
const ARCHIVE = "Archive";

export default function Inventories() {
  const [inventories, setInventories] = useState<InventoryData[]>([]);
  const [editInventoryIsOpen, setEditInventoryIsOpen] = useState(false);
  const [createInventoryIsOpen, setCreateInventoryIsOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryData>();

  const params = useSearchParams();
  const orgID = Number(params.get("org_id")) || -1;
  const menuItems = [EDIT, ARCHIVE];

  useEffect(() => {
    // TODO: uncomment when backend is hooked up
    // backendService.get(`organizations/${orgID}/inventories`)
    //   .then(response => {
    //     setInventories(response.results as Inventory[]);
    //   })
    setInventories(testInventory.data.results)
  }, [orgID]);

  const onMenuItemClick = (item: string) => {
    switch(item) {
      case EDIT:
        setEditInventoryIsOpen(true);
        break;
      case ARCHIVE:
        if(selectedInventory) {
          archiveInventory(selectedInventory.id);
        }
        break;
    }
  }

  const onOpenChange = (open: boolean, inventory: InventoryData) => {
    if(open) {
      setEditInventoryIsOpen(false);
      setCreateInventoryIsOpen(false);
      setSelectedInventory(inventory);
    }
  }

  const archiveInventory = (inventoryID: number) => {
    //TODO
  }

  return <>
    <Search 
      apiRoute={`/organizations/${orgID}/inventories`}
      receiveData={(data) => setInventories(data)}
      newButtonEvent={() => setCreateInventoryIsOpen(true)}
    />
    <div className="px-[1rem] py-[2rem]">
      {inventories.map((inventory, index) => 
        <div
          key={inventory.id}
          className={`flex justify-between mb-[0.5rem] px-[0.75rem] py-[1rem] rounded min-h-[6.25rem] drop-shadow-sm ${index % 2 == 0 ? "bg-[#034FA7]" : "bg-[#002856]"}`}
        >
          <h3 className="text-white hover:underline">
            <Link href={`/inventories/inventory?org_id=${orgID}&inventory_id=${inventory.id}`}>{inventory.name}</Link>
          </h3>
          <p className="text-white">{inventory.location}</p>
          <div>
            {/** TODO: change once fields have been established */}
            <p className="text-white">XX Different Parts</p>
            <p className="text-white">XXX Total Inventory</p>
          </div>
          <Menu 
            onOpenChange={open => onOpenChange(open, inventory)}
            items={menuItems}
            onItemClick={item => onMenuItemClick(item)}
            className="text-white text-lg"
          />
        </div>
      )}
    </div>
    {selectedInventory && 
    <Modal
      isOpen={editInventoryIsOpen}
      onClose={() => setEditInventoryIsOpen(false)}
    >
      <EditInventoryModal
        organizationID={orgID}
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
        organizationID={orgID}
        onClose={() => setCreateInventoryIsOpen(false)}
        />
    </Modal>
  </>
}