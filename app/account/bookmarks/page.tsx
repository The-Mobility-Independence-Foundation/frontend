"use client"

import Search from "@/app/components/Search";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { useCallback, useEffect, useState } from "react";
import { ListingData, Listings } from "../../models/Listings";
import Listing from "../../components/Listing";
import { CheckedState } from "@radix-ui/react-checkbox";
import BulkOperations from "../../components/BulkOperations";
import { statuses } from "../../models/Status";
// import KeysetPagination from "../../components/KeysetPagination";
import Modal from "@/app/components/modals/Modal";
import Dialog from "@/app/components/modals/Dialog";
import { userEmitter } from "@/app/layout";
import { UserData } from "@/app/models/User";

const REMOVE = "Remove";

export default function AccountBookmarks() {
  const [listingsChecked, setListingsChecked] = useState<Map<ListingData, boolean>>(new Map());
  const [listingsStatus, setListingsStatus] = useState<Map<ListingData, number>>(new Map());
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [removeListingIsOpen, setRemoveListingIsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingData>();
  const [userID, setUserID] = useState(""); // TODO: change to obj that contains pagination info

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

  useEffect(() => {
    userEmitter.on("user", (userEmitted: UserData) => {
      setUserID(userEmitted.id);
    })
  })

  const receiveListings = useCallback((data: object) => {
    // received from Search component
    const responseData = (data as Listings).data;
    setListings(data as Listings);
    setListingsChecked(new Map(responseData.results.map(listing => [listing, false])));
    setListingsStatus(new Map(responseData.results.map(listing => [listing, statuses.indexOf(listing.status)+1])));
  }, []);

  const onCheckboxChange = (listing: ListingData, checked: CheckedState) => {
    if(checked == 'indeterminate') { return; }
    const listingsCheckedUpdate = new Map(listingsChecked);
    listingsCheckedUpdate.set(listing, checked);
    setListingsChecked(new Map(listingsCheckedUpdate));
    setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  }

  const onStatusChange = (listing: ListingData, status: number) => {
    const listingsStatusUpdate = new Map(listingsStatus);
    listingsStatusUpdate.set(listing, status);
    setListingsStatus(new Map(listingsStatusUpdate));
  }

  const onCheckAllChange = (checked: CheckedState) => {
    if(checked == 'indeterminate') { return; }
    const listingsCheckedUpdate = new Map(listingsChecked);
    listingsCheckedUpdate.forEach((val, key) => { listingsCheckedUpdate.set(key, checked) });
    setListingsChecked(new Map(listingsCheckedUpdate));
    setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  }

  const onBulkRemove = () => {
    listings.data?.results.forEach(() => {}); // TODO add api call for removing bookmark
  }

  const onRemoveDialogClose = (confirm: boolean) => {
    // TODO: api call
    console.log(confirm);
    setRemoveListingIsOpen(false);
  }

  const onOpenChange = (open: boolean, listing: ListingData) => {
    if(open) {
      setRemoveListingIsOpen(false);
      setSelectedListing(listing);
    }
  }

  const onMenuItemClick = (item: string) => {
    switch(item) {
      case REMOVE:
        setRemoveListingIsOpen(true);
        break;
    }
  }

  return <>
    <div>
      {/** TODO: Uncomment */}
      {/* <Search 
        apiRoute={`/users/${userID}/bookmarks`}
        searchBy={"name"}
        receiveResponse={receiveListings}
        filterType={FilterComponentType.LISTINGS}
        placeholderText="Search Bookmarked Listings"
      /> */}
    </div>
    
    {showBulkOps && <BulkOperations onCheckboxChange={onCheckAllChange} onDelete={onBulkRemove}></BulkOperations>}

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
      isOpen={removeListingIsOpen}
      onClose={() => setRemoveListingIsOpen(false)}
    >
      <Dialog
        text={"Are you sure you would like to remove this bookmarked listing?"}
        onClose={onRemoveDialogClose}
        header={`Remove ${selectedListing.title}?`}
      />
    </Modal>}

    {/** TODO: Uncomment */}
    {/* <KeysetPagination 
      hasNextPage={listings.data.hasNext}
      hasPreviousPage={false}
      nextCursor={listings.data.nextToken}
      previousCursor={listings.data.}
    /> */}
  </>
}