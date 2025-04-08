"use client";

import CreateListing from "@/app/components/CreateListing";
import Search from "@/app/components/Search";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ListingData,
  Listings,
  LISTING_STATUSES,
  ListingDelete,
} from "../models/Listings";
import Listing from "../components/Listing";
// import { CheckedState } from "@radix-ui/react-checkbox";
// import BulkOperations from "../components/BulkOperations";
import Modal from "@/app/components/modals/Modal";
import EditListingAttachmentModal from "@/app/components/modals/EditListingAttachment";
import Dialog from "@/app/components/modals/Dialog";
import { userEmitterBus } from "@/lib/userEmitterBus";
import { UserData } from "@/app/models/User";
import PaginationComponent from "@/app/components/Pagination";
import { Spinner } from "@/components/ui/spinner";
import backendService from "../services/backend.service";
import { toastErrors } from "../models/Generic";
import { toast } from "sonner";

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
  // const [showBulkOps, setShowBulkOps] = useState(false);
  const [editListingIsOpen, setEditListingIsOpen] = useState(false);
  const [deleteListingIsOpen, setDeleteListingIsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingData>();
  const [listings, setListings] = useState<Listings>();
  const [loading, setLoading] = useState(false);
  const [orgID, setOrgID] = useState("");

  const searchRef = useRef<{
    executeSearch: () => void;
    clearSearch: () => void;
  } | null>(null);

  const refreshListings = useCallback(() => {
    if (searchRef.current) {
      searchRef.current.clearSearch();
      searchRef.current.executeSearch();
    }
  }, []);

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      if (userEmitted.organization) {
        setOrgID(userEmitted.organization.id);
      }
    });
  });

  const receiveListings = useCallback((data: object) => {
    // received from Search component
    const dataAsListings = data as Listings;
    setListings(dataAsListings);
    const checkedMap = new Map<ListingData, boolean>();
    const statusMap = new Map<ListingData, number>();
    dataAsListings.data.results.forEach((listing) => {
      checkedMap.set(listing, false);
      statusMap.set(
        listing,
        LISTING_STATUSES.indexOf(listing.status.toUpperCase()) + 1
      );
    });
    setListingsChecked(checkedMap);
    setListingsStatus(statusMap);
  }, []);

  // const onCheckboxChange = (listing: ListingData, checked: CheckedState) => {
  //   if (checked == "indeterminate") {
  //     return;
  //   }

  //   const listingsCheckedUpdate = new Map(listingsChecked);
  //   listingsCheckedUpdate.set(listing, checked);

  //   setListingsChecked(new Map(listingsCheckedUpdate));

  //   setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  // };

  const onListingStateChange = (listing: ListingData, status: number) => {
    const listingsStatusUpdate = new Map(listingsStatus);
    listingsStatusUpdate.set(listing, status);

    setListingsStatus(new Map(listingsStatusUpdate));
  };

  // const onCheckAllChange = (checked: CheckedState) => {
  //   if (checked == "indeterminate") {
  //     return;
  //   }

  //   const listingsCheckedUpdate = new Map(listingsChecked);
  //   listingsCheckedUpdate.forEach((val, key) => {
  //     listingsCheckedUpdate.set(key, checked);
  //   });

  //   setListingsChecked(new Map(listingsCheckedUpdate));

  //   setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  // };

  // const onBulkStatusChange = (status: number) => {
  //   const listingsStatusUpdate = new Map(listingsStatus);
  //   listingsStatusUpdate.forEach((val, key) => {
  //     if (listingsChecked.get(key)) {
  //       listingsStatusUpdate.set(key, status);
  //     }
  //   });

  //   setListingsStatus(new Map(listingsStatusUpdate));
  // };

  // const onBulkDelete = () => {
  //   listings?.data.results.forEach(() => {

  //   });
  // };

  const onDeleteDialogClose = (confirm: boolean) => {
    setDeleteListingIsOpen(false);
    if (confirm && selectedListing) {
      backendService
        .delete(`/listings/${selectedListing.id}`)
        .then((response) => {
          setSelectedListing(undefined);
          const responseAsListing = response as ListingDelete;
          if (!responseAsListing.success) {
            toastErrors(response);
            return;
          }
          toast(responseAsListing.message);
          refreshListings();
        });
    }
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

  const loadingResponse = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  return (
    <>
      {orgID && (
        <>
          <div>
            <Search
              apiRoute={`/listings?organizationId=${orgID}`}
              searchBy={"query"}
              receiveResponse={receiveListings}
              filterType={FilterComponentType.LISTINGS}
              placeholderText="Search My Listings"
              newButtonEvent={() => setNewListingDropdownIsOpen(true)}
              loadingResponse={loadingResponse}
              ref={searchRef}
            />
            <div
              className={`absolute z-50 ${
                newListingDropdownIsOpen
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              } transition-all duration-200 ease-in-out w-screen`}
            >
              <CreateListing
                onClose={() => setNewListingDropdownIsOpen(false)}
              />
              <div
                className="w-full h-screen bg-black/20"
                onClick={() => setNewListingDropdownIsOpen(false)}
              />
            </div>
          </div>

          {/* {showBulkOps && (
        <BulkOperations
          onCheckboxChange={onCheckAllChange}
          onChangeActiveStatus={onBulkStatusChange}
          onDelete={onBulkDelete}
        ></BulkOperations>
      )} */}
          {listings && (
            <>
              <div className="px-[1rem] pt-[1.25rem] h-[75vh] min-h-0 overflow-y-auto">
                {loading && <Spinner />}
                {listings.data.results.length == 0 && (
                  <h4 className="text-gray-400">You have no listings</h4>
                )}
                {!loading && listings.data.results.length > 0 && (
                  <div className="flex flex-wrap">
                    {listings.data.results.map((listing) => (
                      <Listing
                        myListing={true}
                        // onCheckboxChange={(checked) =>
                        //   onCheckboxChange(listing, checked)
                        // }
                        checked={listingsChecked.get(listing)}
                        onStateChange={(state) =>
                          onListingStateChange(listing, state)
                        }
                        activeState={listingsStatus.get(listing)}
                        listing={listing}
                        onOpenChange={onOpenChange}
                        onMenuItemClickModal={onMenuItemClick}
                        className="mb-[1rem] mx-auto"
                        key={listing.id}
                      />
                    ))}
                  </div>
                )}
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

              <PaginationComponent
                hasNextPage={listings.data.hasNextPage}
                hasPreviousPage={listings.data.hasPreviousPage}
                nextCursor={listings.data.nextCursor}
                previousCursor={listings.data.previousCursor}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
