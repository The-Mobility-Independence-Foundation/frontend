"use client";

import Search from "@/app/components/Search";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { useCallback, useEffect, useState } from "react";
import {
  BookmarkData,
  Bookmarks,
  LISTING_STATES,
  ListingData,
  Listings,
} from "../../models/Listings";
import Listing from "../../components/Listing";
import { CheckedState } from "@radix-ui/react-checkbox";
import BulkOperations from "../../components/BulkOperations";
import KeysetPagination from "../../components/KeysetPagination";
import Modal from "@/app/components/modals/Modal";
import Dialog from "@/app/components/modals/Dialog";
import { userEmitterBus } from "@/app/layout";
import { UserData } from "@/app/models/User";
import { Spinner } from "@/components/ui/spinner";

const ARCHIVE = "Archive";

export default function AccountBookmarks() {
  const [bookmarksChecked, setBookmarksChecked] = useState<
    Map<BookmarkData, boolean>
  >(new Map());
  const [listingState, setListingsStatus] = useState<Map<ListingData, number>>(
    new Map()
  );
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [archiveListingIsOpen, setArchiveListingIsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingData>();
  const [userID, setUserID] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmarks>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      setUserID(userEmitted.id);
    });
  });

  const receiveListings = useCallback((data: object) => {
    const dataAsBookmarks = data as Bookmarks;
    console.log(dataAsBookmarks);
    setBookmarks(dataAsBookmarks);
    setBookmarksChecked(
      new Map(dataAsBookmarks.data.results.map((bookmark) => [bookmark, false]))
    );
    setListingsStatus(
      new Map(
        dataAsBookmarks.data.results.map((bookmark) => [
          bookmark.listing,
          LISTING_STATES.indexOf(bookmark.listing.state) + 1,
        ])
      )
    );
  }, []);

  const onCheckboxChange = (bookmark: BookmarkData, checked: CheckedState) => {
    if (checked == "indeterminate") {
      return;
    }
    const bookmarksCheckedUpdate = new Map(bookmarksChecked);
    bookmarksCheckedUpdate.set(bookmark, checked);
    setBookmarksChecked(new Map(bookmarksCheckedUpdate));
    setShowBulkOps(bookmarksCheckedUpdate.values().toArray().includes(true));
  };

  const onStateChange = (listing: ListingData, state: number) => {
    const listingStateUpdate = new Map(listingState);
    listingStateUpdate.set(listing, state);
    setListingsStatus(new Map(listingStateUpdate));
  };

  const onCheckAllChange = (checked: CheckedState) => {
    if (checked == "indeterminate") {
      return;
    }
    const bookmarksCheckedUpdate = new Map(bookmarksChecked);
    bookmarksCheckedUpdate.forEach((val, key) => {
      bookmarksCheckedUpdate.set(key, checked);
    });
    setBookmarksChecked(new Map(bookmarksCheckedUpdate));
    setShowBulkOps(bookmarksCheckedUpdate.values().toArray().includes(true));
  };

  const onBulkArchive = () => {
    bookmarks?.data.results.forEach(() => {}); // TODO add api call for removing bookmark
  };

  const onArchiveDialogClose = (confirm: boolean) => {
    // TODO: api call
    console.log(confirm);
    setArchiveListingIsOpen(false);
  };

  const onOpenChange = (open: boolean, listing: ListingData) => {
    if (open) {
      setArchiveListingIsOpen(false);
      setSelectedListing(listing);
    }
  };

  const onMenuItemClick = (item: string) => {
    switch (item) {
      case ARCHIVE:
        setArchiveListingIsOpen(true);
        break;
    }
  };

  const onSearchLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  return (
    <>
      {userID && (
        <div className="relative h-full">
          <Search
            apiRoute={`/users/${userID}/bookmarks`}
            searchBy={"name"}
            receiveResponse={receiveListings}
            filterType={FilterComponentType.LISTINGS}
            placeholderText="Search Bookmarks"
            loadingResponse={onSearchLoading}
          />

          {loading && <Spinner className="mt-[1rem]" />}
          {!loading && bookmarks && (
            <>
              {showBulkOps && (
                <BulkOperations
                  onCheckboxChange={onCheckAllChange}
                  onDelete={onBulkArchive}
                ></BulkOperations>
              )}

              <div className="px-[1rem] pt-[1.25rem] h-[75vh] min-h-0 overflow-y-auto">
                {bookmarks.data.results.length == 0 && <h4 className="text-gray-400">You have no bookmarks</h4>}
                {bookmarks.data.results.map((bookmark) => (
                  <Listing
                    onCheckboxChange={(checked) =>
                      onCheckboxChange(bookmark, checked)
                    }
                    checked={bookmarksChecked.get(bookmark)}
                    onStateChange={(state) =>
                      onStateChange(bookmark.listing, state)
                    }
                    activeState={listingState.get(bookmark.listing)}
                    listing={bookmark.listing}
                    onOpenChange={onOpenChange}
                    onMenuItemClickModal={onMenuItemClick}
                    className="mb-[1rem] mx-auto animate-fadeIn"
                    key={bookmark.id}
                  />
                ))}
              </div>

              {selectedListing && (
                <Modal
                  isOpen={archiveListingIsOpen}
                  onClose={() => setArchiveListingIsOpen(false)}
                >
                  <Dialog
                    text={
                      "Are you sure you would like to archive this bookmarked listing?"
                    }
                    onClose={onArchiveDialogClose}
                    header={`Archive ${selectedListing.name}?`}
                  />
                </Modal>
              )}

              <KeysetPagination
                hasNextPage={bookmarks.data.hasNextPage}
                hasPreviousPage={bookmarks.data.hasPreviousPage}
                nextCursor={bookmarks.data.nextCursor}
                previousCursor={bookmarks.data.previousCursor}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
