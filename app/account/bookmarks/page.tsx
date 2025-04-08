"use client";

import Search from "@/app/components/Search";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookmarkData,
  Bookmarks,
  BookmarksDelete,
  LISTING_STATUSES,
  ListingData,
} from "../../models/Listings";
import Listing from "../../components/Listing";
import { CheckedState } from "@radix-ui/react-checkbox";
import BulkOperations from "../../components/BulkOperations";
import PaginationComponent from "../../components/Pagination";
import Modal from "@/app/components/modals/Modal";
import Dialog from "@/app/components/modals/Dialog";
import { userEmitterBus } from "@/app/layout";
import { UserData } from "@/app/models/User";
import { Spinner } from "@/components/ui/spinner";
import backendService from "@/app/services/backend.service";
import { toastErrors } from "@/app/models/Generic";
import { toast } from "sonner";

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
  const [selectedBookmark, setSelectedBookmark] = useState<BookmarkData>();
  const [userID, setUserID] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmarks>();
  const [loading, setLoading] = useState(false);

  const searchRef = useRef<{
    executeSearch: () => void;
    clearSearch: () => void;
  } | null>(null);
  
  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      setUserID(userEmitted.id);
    });
  });

  const refreshBookmarks = () => {
    if(searchRef.current) {
      searchRef.current.clearSearch();
      searchRef.current.executeSearch();
    }
  }

  const receiveBookmarks = useCallback((data: object) => {
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
          LISTING_STATUSES.indexOf(bookmark.listing.status) + 1,
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

  const archiveBookmark = (bookmark: BookmarkData) => {
    setLoading(true);
    backendService.delete(`/users/${userID}/bookmarks/${bookmark.listing.id}`).then((response) => {
      setLoading(false);
      const responseAsBookmarks = response as BookmarksDelete;
      if(!responseAsBookmarks.success) {
        toastErrors(response);
        return;
      }
      toast(responseAsBookmarks.message);
      refreshBookmarks();
    })
  }

  const onBulkArchive = () => {
    bookmarksChecked.forEach((checked, bookmark) => {
      if(checked) {
        archiveBookmark(bookmark);
      }
    })
  };

  const onArchiveDialogClose = (confirm: boolean) => {
    setArchiveListingIsOpen(false);
    if(confirm && selectedBookmark) {
      archiveBookmark(selectedBookmark);
      setSelectedBookmark(undefined);
    }
  };

  const onOpenBookmarkMenuChange = (open: boolean, bookmark: BookmarkData) => {
    if (open) {
      setArchiveListingIsOpen(false);
      setSelectedBookmark(bookmark);
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
            receiveResponse={receiveBookmarks}
            filterType={FilterComponentType.LISTINGS}
            placeholderText="Search Bookmarks"
            loadingResponse={onSearchLoading}
            ref={searchRef}
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
                  userID={userID}
                    onCheckboxChange={(checked) =>
                      onCheckboxChange(bookmark, checked)
                    }
                    checked={bookmarksChecked.get(bookmark)}
                    onStateChange={(state) =>
                      onStateChange(bookmark.listing, state)
                    }
                    activeState={listingState.get(bookmark.listing)}
                    listing={bookmark.listing}
                    onOpenMenuChange={(open) => onOpenBookmarkMenuChange(open, bookmark)}
                    onMenuItemClickModal={onMenuItemClick}
                    className="mb-[1rem] mx-auto animate-fadeIn"
                    key={bookmark.id}
                  />
                ))}
              </div>

              {selectedBookmark && (
                <Modal
                  isOpen={archiveListingIsOpen}
                  onClose={() => setArchiveListingIsOpen(false)}
                >
                  <Dialog
                    text={
                      "Are you sure you would like to archive this bookmarked listing?"
                    }
                    onClose={onArchiveDialogClose}
                    header={`Archive ${selectedBookmark.listing.name}?`}
                  />
                </Modal>
              )}

              <PaginationComponent
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
