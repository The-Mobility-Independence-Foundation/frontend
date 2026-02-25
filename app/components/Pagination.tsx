import {
  Pagination,
  PaginationItem,
  PaginationNext,
  // PaginationPrevious,
} from "@/components/ui/pagination";
import EventEmitter from "events";
import { useEffect } from "react";

interface KeysetPaginationProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: string | null;
  previousCursor: string | null;
}

export const paginationEventBus = new EventEmitter();
export const PAGE_CHANGE_EVENT = "pageChange";

export default function PaginationComponent({
  hasNextPage,
  hasPreviousPage,
  nextCursor,
  previousCursor,
}: KeysetPaginationProps) {
  useEffect(() => {
    // Appeases the build script
    const noop = () => {};
    noop();
  }, [hasPreviousPage, previousCursor]);

  return (
    <Pagination className="absolute left-[1rem] bottom-[1rem] justify-start items-center">
      {/* As of now there is no functionality in the backend for going back a page. In the event that gets figured out just uncomment this and it'll work **/}
      {/* <PaginationItem
      onClick={() => paginationEventBus.emit(PAGE_CHANGE_EVENT, previousCursor)}
      className={`list-none ${hasPreviousPage ? "cursor-pointer" : "pointer-events-none"} border rounded`}
    >
      <PaginationPrevious />
    </PaginationItem> */}
      <div className="w-[1px] h-[2rem] bg-[#d9d9d9] mx-[1rem]" />
      <PaginationItem
        onClick={() => paginationEventBus.emit(PAGE_CHANGE_EVENT, nextCursor)}
        className={`list-none ${
          hasNextPage ? "cursor-pointer" : "pointer-events-none"
        } border rounded`}
      >
        <PaginationNext />
      </PaginationItem>
    </Pagination>
  );
}
