"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {v4 as uuidv4} from "uuid";

export interface PageChangeEvent {
  currentPage: number;
}

export enum PaginationSearchParams {
  OFFSET = "offset",
  LIMIT = "limit"
}

interface Box {
  value: number | string;
  id: string;
}

interface PaginationProps {
  count: number;
  totalCount: number;
  hasNext: boolean;
  nextToken: string | null;
  onPageChange?: (event: PageChangeEvent) => void;
  className?: string
}

// Every time the page changes, the page reroutes with new query params "offset", and "limit"
// TODO: bug where existing query params are missed with Pagination on page
// TODO: rework with keyset
export default function PaginationComponent({count, totalCount, hasNext, nextToken, onPageChange, className}: PaginationProps) {
  // default page data
  const calculateCurrentPage = () => {
    let currentPage;
    if(nextToken) {
      currentPage = Math.floor((parseInt(nextToken)-1)/count);
    } else {
      if(totalCount == 0) {
        currentPage = 1;
      } else {
        currentPage = Math.ceil(totalCount/count);
      }
    }
    return currentPage;
  }

  const [page, setPage] = useState(calculateCurrentPage());
  const numberOfPages = Math.ceil(totalCount / count);
  const router = useRouter();
  const pathname = usePathname();

  const reroutePage = (offset: number, limit: number) => {
    router.push(`${pathname}?${PaginationSearchParams.OFFSET}=${offset}&${PaginationSearchParams.LIMIT}=${limit}`);
  }

  useEffect(() => {
    setBoxes(getAllBoxes(page));
    reroutePage((page - 1) * count, count);
    if(onPageChange) {
      onPageChange({currentPage: page});
    }
  }, [page, totalCount, count]);

  const getAllBoxes = (currentPage: number): Box[] => {
    // set the new boxes that are rendered
    const newBoxes: Box[] = [];
    if (totalCount == count) {
      newBoxes.push({value: 1, id: uuidv4()});
      return newBoxes
    }
    // always include the first 2 pages
    // always include the current page and its neighbors
    // always include the last two pages
    // insert ellipsis where there is a gap between pages
    let ellipsisAdded = false;
    for(let i = 1; i <= numberOfPages; i++) {
      if (i <= 2 
          || i >= numberOfPages - 1 
          || Math.abs(i - currentPage) <= 1) {
        newBoxes.push({value: i, id: uuidv4()});
        ellipsisAdded = false;
      } else if (!ellipsisAdded) {
        newBoxes.push({value: "...", id: uuidv4()});
        ellipsisAdded = true;
      }
    }
    return newBoxes;
  }
  const [boxes, setBoxes] = useState(getAllBoxes(calculateCurrentPage()));

  return <Pagination className={`w-[34rem] absolute left-[1rem] bottom-[1rem] justify-start ${className}`}>
    <PaginationContent className="w-full">
      <PaginationItem 
        onClick={() => setPage(page - 1)}
        className={`cursor-pointer ${page == 1 ? "pointer-events-none" : "pointer-events-auto"}`}
        >
        <PaginationPrevious/>
      </PaginationItem>
      {boxes.map(box => {
        return box.value === "..." ? <PaginationItem key={box.id}><PaginationEllipsis/></PaginationItem> : 
        <PaginationItem 
          key={box.id}  
          onClick={() => setPage(box.value as number)}
          className="cursor-pointer"
        >
          <PaginationLink isActive={page == box.value}>
            {box.value}
          </PaginationLink>
        </PaginationItem>
      })}
      <PaginationItem 
        onClick={() => setPage(page + 1)}
        className={`cursor-pointer !ml-auto ${!hasNext ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <PaginationNext />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
}