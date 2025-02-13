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
import { useState } from "react";
import {v4 as uuidv4} from "uuid";

export interface PageChangeEvent {
  currentPage: number;
}

interface Box {
  value: number | string;
  id: string;
}

interface PaginationProps {
  count: number;
  total: number;
  hasNext: boolean;
  nextToken: number;
  onPageChange: (event: PageChangeEvent) => {};
}

export default function PaginationComponent({count, total, hasNext, nextToken, onPageChange}: PaginationProps) {
  // default page data
  const [page, setPage] = useState(Math.floor((nextToken-1)/count));
  const numberOfPages = Math.ceil(total / count);

  const changePage = (newPage: number) => {
    // Set the new item indices
    setPage(newPage);
    setBoxes(getAllBoxes(newPage));
    onPageChange({currentPage: newPage});
  };

  const getAllBoxes = (currentPage: number): Box[] => {
    // set the new boxes that are rendered
    // always include the first 2 pages
    // always include the current page and its neighbors
    // always include the last two pages
    // insert ellipsis where there is a gap between pages
    const newBoxes: Box[] = [];
    let ellipsisAdded = false;
    for(let i = 1; i <= numberOfPages; i++) {
      if (i <= 2 || 
          i >= numberOfPages - 1 || 
          Math.abs(i - currentPage) <= 1) {
        newBoxes.push({value: i, id: uuidv4()});
        ellipsisAdded = false;
      } else if (!ellipsisAdded) {
        newBoxes.push({value: "...", id: uuidv4()});
        ellipsisAdded = true;
      }
    }
    return newBoxes;
  }

  const [boxes, setBoxes] = useState(getAllBoxes(Math.floor((nextToken-1)/count)));

  return <Pagination className="w-[34rem] absolute left-[1rem] bottom-[1rem] justify-start">
    <PaginationContent className="w-full">
      <PaginationItem 
        onClick={() => changePage(page - 1)}
        className={`cursor-pointer ${page == 1 ? "pointer-events-none" : "pointer-events-auto"}`}
        >
        <PaginationPrevious/>
      </PaginationItem>
      {boxes.map(box => {
        return box.value === "..." ? <PaginationItem key={box.id}><PaginationEllipsis/></PaginationItem> : 
        <PaginationItem 
          key={box.id}  
          onClick={() => changePage(box.value as number)}
          className="cursor-pointer"
        >
          <PaginationLink isActive={page == box.value}>
            {box.value}
          </PaginationLink>
        </PaginationItem>
      })}
      <PaginationItem 
        onClick={() => changePage(page + 1)}
        className={`cursor-pointer !ml-auto ${page == numberOfPages ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <PaginationNext />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
}