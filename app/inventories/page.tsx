"use client"

import { useCallback, useRef, useState } from "react";
import { Inventory, InventoryData } from "../models/Inventory";
import Modal from "../components/modals/Modal";
import EditInventoryModal from "../components/modals/EditInventory";
import CreateInventoryModal from "../components/modals/CreateInventory";
import Search from "../components/Search";
import Menu from "../components/Menu";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Dialog from "../components/modals/Dialog";
import { Spinner } from "@/components/ui/spinner";
import KeysetPagination from "../components/KeysetPagination";
import { PaginationData } from "../models/Generic";

const EDIT = "Edit";
const ARCHIVE = "Archive";
const RESTORE = "Restore";

export default function Inventories() {
  const [inventories, setInventories] = useState<InventoryData[]>([]);
  const [editInventoryIsOpen, setEditInventoryIsOpen] = useState(false);
  const [createInventoryIsOpen, setCreateInventoryIsOpen] = useState(false);
  const [archiveInventoryIsOpen, setArchiveInventoryIsOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryData>();
  const [loadingInventories, setLoadingInventories] = useState(false);
  const [paginationData, setPaginationData] = useState<PaginationData>();

  const params = useSearchParams();
  const orgID = Number(params.get("org_id")) || -1;
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
      case RESTORE:
        // TODO
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
    if(confirm) {}
    //TODO
  }

  const receiveInventories = useCallback((response: object) => {
    const responseData = (response as Inventory).data;
    setInventories(responseData.results);
    setPaginationData({
      hasNextPage: responseData.hasNextPage,
      hasPreviousPage: responseData.hasPreviousPage,
      nextCursor: responseData.nextCursor,
      previousCursor: responseData.previousCursor
    })
  }, []);

  const refreshInventories = () => {
    if(searchRef.current) {
      searchRef.current.clearSearch();
      searchRef.current.executeSearch();
    }
  }

  const onCreateInventoryClose = (submit: boolean) => {
    setCreateInventoryIsOpen(false);
    if(submit) {
      refreshInventories();
    }
  }

  const onEditInventoryClose = (submit: boolean) => {
    setEditInventoryIsOpen(false);
    if(submit) {
      refreshInventories();
    }
  }

  return <>
    <Search 
      apiRoute={`/organizations/${orgID}/inventories`}
      searchBy="name"
      receiveResponse={(data) => receiveInventories(data)}
      newButtonEvent={() => setCreateInventoryIsOpen(true)}
      loadingResponse={(loading) => setLoadingInventories(loading)}
      ref={searchRef}
    />
    <div className="px-[1rem] py-[2rem] max-h-[45rem] overflow-y-auto">
      {loadingInventories && <Spinner />}
      {inventories.map((inventory, index) => 
        <div
          key={inventory.id}
          className={`flex justify-between mb-[0.5rem] px-[0.75rem] py-[1rem] rounded min-h-[6.25rem] drop-shadow-sm ${index % 2 == 0 ? "bg-[#034FA7]" : "bg-[#002856]"}`}
        >
          <div className="w-[45%]">
            <div className="flex items-center h-min">
              <h3 className="text-white hover:underline">
                <Link href={`/inventories/inventory?org_id=${orgID}&inventory_id=${inventory.id}`}>{inventory.name}</Link>
              </h3>
              {inventory.archivedAt && <span className="text-white p-[0.2rem] border border-white rounded bg-[#fb5555] font-bold ml-[1rem]">Archived</span>}
            </div>
            <p className="text-white">{inventory.description}</p>
          </div>
          {inventory.address &&
          <div className="text-white">
            <h5>{inventory.address.addressLine1}</h5>
            <h5>{inventory.address.addressLine2}</h5>
            <p>{inventory.address.city}, {inventory.address.state}</p>
            <p>{inventory.address.zipCode}</p>
          </div>
          }
          <Menu 
            onOpenChange={open => onOpenChange(open, inventory)}
            items={inventory.archivedAt ? [EDIT, RESTORE] : [EDIT, ARCHIVE]}
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
        onClose={onEditInventoryClose}
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
    {paginationData && <KeysetPagination 
      hasNextPage={paginationData.hasNextPage}
      hasPreviousPage={paginationData.hasPreviousPage}
      nextCursor={paginationData.nextCursor}
      previousCursor={paginationData.previousCursor}
    />}
  </>
}