"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Inventory, InventoryData } from "../models/Inventory";
import backendService from "../services/backend.service";
import Modal from "../components/modals/Modal";
import EditInventoryModal from "../components/modals/EditInventory";
import CreateInventoryModal from "../components/modals/CreateInventory";
import Search from "../components/Search";
import Menu from "../components/Menu";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Dialog from "../components/modals/Dialog";
import { Spinner } from "@/components/ui/spinner";

const EDIT = "Edit";
const ARCHIVE = "Archive";

export default function Inventories() {
  const [inventories, setInventories] = useState<InventoryData[]>([]);
  const [editInventoryIsOpen, setEditInventoryIsOpen] = useState(false);
  const [createInventoryIsOpen, setCreateInventoryIsOpen] = useState(false);
  const [archiveInventoryIsOpen, setArchiveInventoryIsOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryData>();
  const [loadingInventories, setLoadingInventories] = useState(false);
  
  const params = useSearchParams();
  const orgID = Number(params.get("org_id")) || -1;
  const menuItems = [EDIT, ARCHIVE];
  const searchRef = useRef<{
    executeSearch: () => void,
    clearSearch: () => void
  } | null>(null);

  const onMenuItemClick = (item: string) => {
    switch(item) {
      case EDIT:
        setEditInventoryIsOpen(true);
        break;
      case ARCHIVE:
        setArchiveInventoryIsOpen(true);
        break;
    }
  }

  const onOpenChange = (open: boolean, inventory: InventoryData) => {
    if(open) {
      setEditInventoryIsOpen(false);
      setCreateInventoryIsOpen(false);
      setArchiveInventoryIsOpen(false);
      setSelectedInventory(inventory);
    }
  }

  const archiveSelectedInventory = (confirm: boolean) => {
    setArchiveInventoryIsOpen(false);
    //TODO
  }

  const receiveInventories = useCallback((response: object) => {
    setInventories((response as Inventory).data.results);
  }, []);

  const onCreateInventoryClose = (submit: boolean) => {
    setCreateInventoryIsOpen(false);
    if(submit) {
      if(searchRef.current) {
        searchRef.current.clearSearch();
        searchRef.current.executeSearch();
      }
    }
  }

  return <>
    <Search 
      apiRoute={`/organization/${orgID}/inventory`}
      searchBy="name"
      receiveResponse={(data) => receiveInventories(data)}
      newButtonEvent={() => setCreateInventoryIsOpen(true)}
      loadingResponse={(loading) => setLoadingInventories(loading)}
      ref={searchRef}
    />
    <div className="px-[1rem] py-[2rem]">
      {loadingInventories && <Spinner />}
      {inventories.map((inventory, index) => 
        <div
          key={inventory.id}
          className={`flex justify-between mb-[0.5rem] px-[0.75rem] py-[1rem] rounded min-h-[6.25rem] drop-shadow-sm ${index % 2 == 0 ? "bg-[#034FA7]" : "bg-[#002856]"}`}
        >
          <div className="flex items-center h-min">
            <h3 className="text-white hover:underline">
              <Link href={`/inventories/inventory?org_id=${orgID}&inventory_id=${inventory.id}`}>{inventory.name}</Link>
            </h3>
            {inventory.archivedAt && <span className="text-white p-[0.2rem] border border-white rounded bg-[#fb5555] font-bold ml-[1rem]">Archived</span>}
          </div>
          {/** TODO: format address */}
          {/* <p className="text-white">{inventory.location}</p> */}
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
        onClose={onCreateInventoryClose}
        />
    </Modal>
    {selectedInventory && <Modal
      isOpen={archiveInventoryIsOpen}
      onClose={() => setArchiveInventoryIsOpen(false)}
    >
      <Dialog
        text={"Are you sure you would like to archive this inventory?"}
        onClose={archiveSelectedInventory}
        header={`Archive ${selectedInventory.name}?`}
      />
    </Modal>}
  </>
}