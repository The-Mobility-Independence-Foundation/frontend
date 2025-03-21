import { Pagination, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import EventEmitter from "events";

interface KeysetPaginationProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: string | null;
  previousCursor?: string | null;
  count?: number
}

export const PAGE_CHANGE_EVENT = "pageChange";

// Possibly replacing existing Pagination
export default function PaginationComponent({hasNextPage, hasPreviousPage, nextCursor, previousCursor, count}: KeysetPaginationProps) {
  const emitter = new EventEmitter();
  
  return <Pagination className="absolute left-[1rem] bottom-[1rem] justify-start items-center">
    <PaginationItem
      onClick={() => emitter.emit(PAGE_CHANGE_EVENT, previousCursor)}
      className={`list-none ${hasPreviousPage ? "cursor-pointer" : "pointer-events-none"} border rounded`}
    >
      <PaginationPrevious />
    </PaginationItem>
    <div className="w-[1px] h-[2rem] bg-[#d9d9d9] mx-[1rem]"/>
    <PaginationItem
      onClick={() => emitter.emit(PAGE_CHANGE_EVENT, nextCursor)}
      className={`list-none ${hasNextPage ? "cursor-pointer" : "pointer-events-none"} border rounded`}
    >
      <PaginationNext />
    </PaginationItem>
  </Pagination>
}