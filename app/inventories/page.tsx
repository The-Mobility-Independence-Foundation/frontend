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
import Dialog from "../components/modals/Dialog";

const EDIT = "Edit";
const DELETE = "Delete";

export default function Inventories() {
  const [inventories, setInventories] = useState<InventoryData[]>([]);
  const [editInventoryIsOpen, setEditInventoryIsOpen] = useState(false);
  const [createInventoryIsOpen, setCreateInventoryIsOpen] = useState(false);
  const [deleteInventoryIsOpen, setDeleteInventoryIsOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryData>();

  const organizationID = 1; // TODO: fetch ORG ID
  const menuItems = [EDIT, DELETE];

  useEffect(() => {
    // TODO: uncomment when backend is hooked up
    // backendService.get(`organizations/${organizationID}/inventories`)
    //   .then(response => {
    //     setInventories(response.results as Inventory[]);
    //   })
    setInventories(testInventory.data.results)
  }, [organizationID]);

  const onMenuItemClick = (item: string) => {
    switch(item) {
      case EDIT:
        setEditInventoryIsOpen(true);
        break;
      case DELETE:
        setDeleteInventoryIsOpen(true);
        break;
    }
  }

  const onOpenChange = (open: boolean, inventory: InventoryData) => {
    if(open) {
      setEditInventoryIsOpen(false);
      setCreateInventoryIsOpen(false);
      setDeleteInventoryIsOpen(false);
      setSelectedInventory(inventory);
    }
  }

  const onDeleteDialogClose = (confirm: boolean) => {
    console.log(confirm);
    // TODO: api call
    setDeleteInventoryIsOpen(false);
  }

  return <>
    <Search 
      apiRoute={`/organizations/${organizationID}/inventories`}
      receiveData={(data) => setInventories(data)}
      newButtonEvent={() => setCreateInventoryIsOpen(true)}
    />
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
    {selectedInventory && <Modal
      isOpen={deleteInventoryIsOpen}
      onClose={() => setDeleteInventoryIsOpen(false)}
    >
      <Dialog
        text={"Are you sure you would like to delete this inventory? Deleting the inventory will also delete all of its store parts."}
        onClose={onDeleteDialogClose}
        header={`Delete ${selectedInventory.name}?`}
      />
    </Modal>}
  </>
}