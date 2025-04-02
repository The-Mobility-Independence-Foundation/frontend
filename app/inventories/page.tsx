"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { Inventory, InventoryData } from "../models/Inventory";
import Modal from "../components/modals/Modal";
import EditInventoryModal from "../components/modals/EditInventory";
import CreateInventoryModal from "../components/modals/CreateInventory";
import Search from "../components/Search";
import Menu from "../components/Menu";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Dialog from "../components/modals/Dialog";
import { Spinner } from "@/components/ui/spinner";
import KeysetPagination from "../components/KeysetPagination";
import { PaginationData } from "../models/Generic";
import backendService from "../services/backend.service";
import { toast } from "sonner";
import { userEmitter } from "../layout";
import { UserData } from "../models/User";

const EDIT = "Edit";
const ARCHIVE = "Archive";
// const RESTORE = "Restore";

// TODO: separate tabs for archived inventories
export default function Inventories() {
  const [inventories, setInventories] = useState<InventoryData[]>([]);
  const [editInventoryIsOpen, setEditInventoryIsOpen] = useState(false);
  const [createInventoryIsOpen, setCreateInventoryIsOpen] = useState(false);
  const [archiveInventoryIsOpen, setArchiveInventoryIsOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryData | null>(null);
  const [loadingInventories, setLoadingInventories] = useState(false);
  const [paginationData, setPaginationData] = useState<PaginationData>();
  const [orgID, setOrgID] = useState(-1);

  const router = useRouter();

  useEffect(() => {
    userEmitter.on("user", (userEmitted: UserData) => {
      if(userEmitted.organization) {
        setOrgID(userEmitted.organization.id as unknown as number);
      } else {
        router.back();
      }
    })
  })

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
      // case RESTORE:
      //   break;
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
    if(confirm && selectedInventory) {
      setLoadingInventories(true);
      backendService.delete(`/organizations/${orgID}/inventories/${selectedInventory.id}`)
        .then(response => {
          const responseAsInventory = response as Inventory;
          if(responseAsInventory.success) {
            toast(responseAsInventory.message);
            setSelectedInventory(null);
            refreshInventories();
          }
          setLoadingInventories(false);
        })
    }
  }

  const receiveInventories = useCallback((response: object) => {
    if(orgID > -1) {
      const responseData = (response as Inventory).data;
      setInventories(responseData.results);
      setPaginationData({
        hasNextPage: responseData.hasNextPage,
        hasPreviousPage: responseData.hasPreviousPage,
        nextCursor: responseData.nextCursor,
        previousCursor: responseData.previousCursor
      })
    }
  }, [orgID]);

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

  return (
    <>
      {orgID > -1 && (
        <>
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
            {!loadingInventories &&
              inventories.map((inventory, index) => (
                <div
                  key={inventory.id}
                  className={`animate-fadeIn flex justify-between mb-[0.5rem] px-[0.75rem] py-[1rem] rounded min-h-[6.25rem] drop-shadow-sm ${
                    index % 2 == 0 ? "bg-[#034FA7]" : "bg-[#002856]"
                  }`}
                >
                  <div className="w-[45%]">
                    <div className="flex items-start h-min">
                      <h3 className="text-white hover:underline">
                        <Link
                          href={`/inventories/inventory?inventoryID=${inventory.id}`}
                        >
                          {inventory.name}
                        </Link>
                      </h3>
                      {inventory.archivedAt && (
                        <span className="text-white p-[0.2rem] border border-white rounded bg-[#fb5555] font-bold ml-[1rem] mt-[0.75rem]">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="text-white">{inventory.description}</p>
                  </div>
                  {inventory.address && (
                    <div>
                      <h5 className="text-white">
                        {inventory.address.addressLine1}
                      </h5>
                      <h5 className="text-white">
                        {inventory.address.addressLine2}
                      </h5>
                      <p className="text-white">
                        {inventory.address.city}, {inventory.address.state}
                      </p>
                      <p className="text-white">{inventory.address.zipCode}</p>
                    </div>
                  )}
                  <Menu
                    onOpenChange={(open) => onOpenChange(open, inventory)}
                    items={
                      inventory.archivedAt ? [EDIT] : [EDIT, ARCHIVE]
                    }
                    onItemClick={(item) => onMenuItemClick(item)}
                    className="text-white text-lg"
                  />
                </div>
              ))}
          </div>
          {selectedInventory && (
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
          )}
          <Modal
            isOpen={createInventoryIsOpen}
            onClose={() => setCreateInventoryIsOpen(false)}
          >
            <CreateInventoryModal
              organizationID={orgID}
              onClose={onCreateInventoryClose}
            />
          </Modal>
          {selectedInventory && (
            <Modal
              isOpen={archiveInventoryIsOpen}
              onClose={() => setArchiveInventoryIsOpen(false)}
            >
              <Dialog
                text={"Are you sure you would like to archive this inventory?"}
                onClose={archiveSelectedInventory}
                header={`Archive ${selectedInventory.name}?`}
              />
            </Modal>
          )}
          {paginationData && (
            <KeysetPagination
              hasNextPage={paginationData.hasNextPage}
              hasPreviousPage={paginationData.hasPreviousPage}
              nextCursor={paginationData.nextCursor}
              previousCursor={paginationData.previousCursor}
            />
          )}
        </>
      )}
    </>
  );
}