"use client";

import CreateListing from "@/app/components/CreateListing";
import Search from "@/app/components/Search";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ListingData, Listings, LISTING_STATES } from "../../models/Listings";
import Listing from "../../components/Listing";
import { CheckedState } from "@radix-ui/react-checkbox";
import BulkOperations from "../../components/BulkOperations";
// import KeysetPagination from "../../components/KeysetPagination";
import Modal from "@/app/components/modals/Modal";
import EditListingAttachmentModal from "@/app/components/modals/EditListingAttachment";
import Dialog from "@/app/components/modals/Dialog";
import KeysetPagination from "@/app/components/KeysetPagination";
import { userEmitter } from "@/app/layout";
import { UserData } from "@/app/models/User";
import { toast } from "sonner";
// import { PaginationData } from "@/app/models/Generic";

const EDIT = "Edit Attachment";
const DELETE = "Delete";

export default function MyListings() {
  const [newListingDropdownIsOpen, setNewListingDropdownIsOpen] =
    useState(false);
  const [listingsChecked, setListingsChecked] = useState<
    Map<ListingData, boolean>
  >(new Map());
  const [listingsStatus, setListingsStatus] = useState<
    Map<ListingData, number>
  >(new Map());
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [editListingIsOpen, setEditListingIsOpen] = useState(false);
  const [deleteListingIsOpen, setDeleteListingIsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingData>();
  // const [paginationData, setPaginationData] = useState<PaginationData>();

  const [listings, setListings] = useState<Listings>();

  useEffect(() => {
    userEmitter.on("user", (userEmitted: UserData) => {
      const router = useRouter();
      const path = usePathname();
      const pathSplit = path.split("/");
      const userIDInRoute = pathSplit[pathSplit.length - 1];
      if (userEmitted.id !== userIDInRoute) {
        toast("Denied from this user's listings")
        router.push(`/listings`);
      }  
    })
  })

  const receiveListings = useCallback((data: object) => {
    // received from Search component
    const responseData = (data as Listings).data;
    setListings(data as Listings);
    setListingsChecked(
      new Map(responseData.results.map((listing) => [listing, false]))
    );
    setListingsStatus(
      new Map(
        responseData.results.map((listing) => [
          listing,
          LISTING_STATES.indexOf(listing.state.toUpperCase()) + 1,
        ])
      )
    );
  }, []);

  const onCheckboxChange = (listing: ListingData, checked: CheckedState) => {
    if (checked == "indeterminate") {
      return;
    }

    const listingsCheckedUpdate = new Map(listingsChecked);
    listingsCheckedUpdate.set(listing, checked);

    setListingsChecked(new Map(listingsCheckedUpdate));

    setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  };

  const onListingStateChange = (listing: ListingData, status: number) => {
    const listingsStatusUpdate = new Map(listingsStatus);
    listingsStatusUpdate.set(listing, status);

    setListingsStatus(new Map(listingsStatusUpdate));
  };

  const onCheckAllChange = (checked: CheckedState) => {
    if (checked == "indeterminate") {
      return;
    }

    const listingsCheckedUpdate = new Map(listingsChecked);
    listingsCheckedUpdate.forEach((val, key) => {
      listingsCheckedUpdate.set(key, checked);
    });

    setListingsChecked(new Map(listingsCheckedUpdate));

    setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  };

  const onBulkStatusChange = (status: number) => {
    const listingsStatusUpdate = new Map(listingsStatus);
    listingsStatusUpdate.forEach((val, key) => {
      if (listingsChecked.get(key)) {
        listingsStatusUpdate.set(key, status);
      }
    });

    setListingsStatus(new Map(listingsStatusUpdate));
  };

  const onBulkDelete = () => {
    listings?.data?.results.forEach(() => {}); // TODO add api call
  };

  const onDeleteDialogClose = (confirm: boolean) => {
    // TODO: api call
    console.log(confirm);
    setDeleteListingIsOpen(false);
  };

  const onOpenChange = (open: boolean, listing: ListingData) => {
    if (open) {
      setEditListingIsOpen(false);
      setDeleteListingIsOpen(false);
      setSelectedListing(listing);
    }
  };

  const onMenuItemClick = (item: string) => {
    switch (item) {
      case EDIT:
        setEditListingIsOpen(true);
        break;
      case DELETE:
        setDeleteListingIsOpen(true);
        break;
    }
  };

  return (
    <>
      <div>
        <Search
          apiRoute="/listing"
          searchBy={"name"}
          receiveResponse={receiveListings}
          filterType={FilterComponentType.LISTINGS}
          placeholderText="Search My Listings"
          newButtonEvent={() => setNewListingDropdownIsOpen(true)}
        />
        <div
          className={`absolute z-50 ${
            newListingDropdownIsOpen
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          } transition-all duration-200 ease-in-out w-screen`}
        >
          <CreateListing onClose={() => setNewListingDropdownIsOpen(false)} />
          <div
            className="w-full h-screen bg-black/20"
            onClick={() => setNewListingDropdownIsOpen(false)}
          />
        </div>
      </div>

      {showBulkOps && (
        <BulkOperations
          onCheckboxChange={onCheckAllChange}
          onChangeActiveStatus={onBulkStatusChange}
          onDelete={onBulkDelete}
        ></BulkOperations>
      )}
      {listings && (
        <>
          <div className="px-[1rem] pt-[1.25rem] h-[75vh] min-h-0 overflow-y-auto">
            {listings.data?.results.map((listing) => (
              <Listing
                myListing={true}
                onCheckboxChange={(checked) =>
                  onCheckboxChange(listing, checked)
                }
                checked={listingsChecked.get(listing)}
                onStateChange={(state) => onListingStateChange(listing, state)}
                activeState={listingsStatus.get(listing)}
                listing={listing}
                onOpenChange={onOpenChange}
                onMenuItemClickModal={onMenuItemClick}
                className="mb-[1rem] mx-auto"
                key={listing.id}
              />
            ))}
          </div>

          {selectedListing && (
            <Modal
              isOpen={editListingIsOpen}
              onClose={() => setEditListingIsOpen(false)}
            >
              <EditListingAttachmentModal
                listingData={selectedListing}
                onClose={() => setEditListingIsOpen(false)}
              />
            </Modal>
          )}
          {selectedListing && (
            <Modal
              isOpen={deleteListingIsOpen}
              onClose={() => setDeleteListingIsOpen(false)}
            >
              <Dialog
                text={"Are you sure you would like to delete this listing?"}
                onClose={onDeleteDialogClose}
                header={`Delete ${selectedListing.name}?`}
              />
            </Modal>
          )}

          <KeysetPagination
            hasNextPage={listings.data.hasNextPage}
            hasPreviousPage={listings.data.hasPreviousPage}
            nextCursor={listings.data.nextCursor}
            previousCursor={listings.data.previousCursor}
          />
        </>
      )}
    </>
  );
}
