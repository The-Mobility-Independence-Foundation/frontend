"use client"

import CreateListing from "@/app/components/CreateListing";
import Search from "@/app/components/Search";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ListingData, Listings } from "../../models/Listings";
import Listing from "../../components/Listing";
import { CheckedState } from "@radix-ui/react-checkbox";
import BulkOperations from "../../components/BulkOperations";
import { statuses } from "../../models/Status";
import KeysetPagination from "../../components/KeysetPagination";
import Modal from "@/app/components/modals/Modal";
import EditListingAttachmentModal from "@/app/components/modals/EditListingAttachment";
import Dialog from "@/app/components/modals/Dialog";

const EDIT = "Edit Attachment";
const DELETE = "Delete";

export default function MyListings() {
  const [newListingDropdownIsOpen, setNewListingDropdownIsOpen] = useState(false);
  const [listingsChecked, setListingsChecked] = useState<Map<ListingData, boolean>>(new Map());
  const [listingsStatus, setListingsStatus] = useState<Map<ListingData, number>>(new Map());
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [editListingIsOpen, setEditListingIsOpen] = useState(false);
  const [deleteListingIsOpen, setDeleteListingIsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingData>();

  const [listings, setListings] = useState<Listings>({
      message: "Default",
      data: {
        count: 0,
        totalCount: 0,
        hasNext: false,
        nextToken: null,
        results: []
      }
    });

  const myUserID = 1; // TODO: grab current user ID from db
  const router = useRouter();
  const path = usePathname();
  const pathSplit = path.split("/");
  const userIDInRoute = pathSplit[pathSplit.length-1];
  if (myUserID !== parseInt(userIDInRoute)) {
    router.push(`/listings`);
  }

  const receiveListings = (data: any) => {
    console.log("receiveListings")
    // received from Search component
    setListings(data as Listings);
    
    setListingsChecked(new Map((data as Listings).data?.results.map(listing => [listing, false])));
    setListingsStatus(new Map((data as Listings).data?.results.map(listing => [listing, statuses.indexOf(listing.status)+1])));
  }

  const onCheckboxChange = (listing: ListingData, checked: CheckedState) => {
    if(checked == 'indeterminate') { return; }

    let listingsCheckedUpdate = new Map(listingsChecked);
    listingsCheckedUpdate.set(listing, checked);

    setListingsChecked(new Map(listingsCheckedUpdate));

    setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  }

  const onStatusChange = (listing: ListingData, status: number) => {
    let listingsStatusUpdate = new Map(listingsStatus);
    listingsStatusUpdate.set(listing, status);

    setListingsStatus(new Map(listingsStatusUpdate));
  }

  const onCheckAllChange = (checked: CheckedState) => {
    if(checked == 'indeterminate') { return; }

    let listingsCheckedUpdate = new Map(listingsChecked);
    listingsCheckedUpdate.forEach((val, key) => { listingsCheckedUpdate.set(key, checked) });

    setListingsChecked(new Map(listingsCheckedUpdate));

    setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  }

  const onBulkStatusChange = (status: number) => {
    let listingsStatusUpdate = new Map(listingsStatus);
    listingsStatusUpdate.forEach((val, key) => { 
      if(listingsChecked.get(key)) {
        listingsStatusUpdate.set(key, status);
      }
    });

    setListingsStatus(new Map(listingsStatusUpdate));
  }

  const onBulkDelete = () => {
    listings.data?.results.forEach(() => {}); // TODO add api call
  }

  const onDeleteDialogClose = (confirm: boolean) => {
    // TODO: api call
    setDeleteListingIsOpen(false);
  }

  const onOpenChange = (open: boolean, listing: ListingData) => {
    if(open) {
      setEditListingIsOpen(false);
      setDeleteListingIsOpen(false);
      setSelectedListing(listing);
    }
  }

  const onMenuItemClick = (item: string) => {
    switch(item) {
      case EDIT:
        setEditListingIsOpen(true);
        break;
      case DELETE:
        setDeleteListingIsOpen(true);
        break;
    }
  }

  return <>
    <div>
      <Search 
        apiRoute="/listing"
        receiveData={receiveListings}
        filterType={FilterComponentType.LISTINGS}
        placeholderText="Search My Listings"
        newButtonEvent={() => setNewListingDropdownIsOpen(true)}
      />
        <div className={`absolute z-50 ${newListingDropdownIsOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-200 ease-in-out w-screen`}>
          <CreateListing
            onClose={() => setNewListingDropdownIsOpen(false)}
          />
          <div className="w-full h-screen bg-black/20" onClick={() => setNewListingDropdownIsOpen(false)} />
        </div>
    </div>
    
    {showBulkOps && <BulkOperations onCheckboxChange={onCheckAllChange} onChangeActiveStatus={onBulkStatusChange} onDelete={onBulkDelete}></BulkOperations>}

    <div className="px-[1rem] pt-[1.25rem] h-[75vh] min-h-0 overflow-y-auto">
      {listings.data?.results.map(listing => 
        <Listing 
          myListing={true}
          onCheckboxChange={(checked) => onCheckboxChange(listing, checked)}
          checked={listingsChecked.get(listing)}
          onStatusChange={(status) => onStatusChange(listing, status)}
          activeStatus={listingsStatus.get(listing)}
          listing={listing}
          onOpenChange={onOpenChange}
          onMenuItemClickModal={onMenuItemClick}
          className="mb-[1rem] mx-auto"
          key={listing.id}
        />
      )}
    </div>

    {selectedListing &&
      <Modal
        isOpen={editListingIsOpen}
        onClose={() => setEditListingIsOpen(false)}
      >
        <EditListingAttachmentModal
          listingData={selectedListing}
          onClose={() => setEditListingIsOpen(false)}
        />
      </Modal> 
    }
    {selectedListing && 
    <Modal
      isOpen={deleteListingIsOpen}
      onClose={() => setDeleteListingIsOpen(false)}
    >
      <Dialog
        text={"Are you sure you would like to delete this listing?"}
        onClose={onDeleteDialogClose}
        header={`Delete ${selectedListing.title}?`}
      />
    </Modal>}

    <KeysetPagination 
      hasNextPage={listings.data.hasNext}
      hasPreviousPage={false}
      nextCursor={listings.data.nextToken}
      count={listings.data.count}
    />
  </>
}