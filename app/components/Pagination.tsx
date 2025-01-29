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

export interface PageChangeEvent {
  startIndex: number;
  endIndex: number;
}

interface Props {
  numberOfItems: number;
  itemsPerPage: number;
  onPageChange: (event: PageChangeEvent) => {};
}

export default function PaginationComponent({numberOfItems, itemsPerPage, onPageChange}: Props) {
  // default page data
  let startIndex = 0;
  let endIndex = numberOfItems < itemsPerPage ? numberOfItems-1 : itemsPerPage-1;
  const [page, setPage] = useState(1);
  const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);
  const [boxes, setBoxes] = useState(numberOfPages > 5 
    ? [1, 2, "...", numberOfPages-1, numberOfPages]
    : Array.from({length: numberOfPages}, (_, index) => index + 1));

  const changePage = (newPage: number) => {
    // Set the new item indices
    setPage(newPage);
    startIndex = (newPage - 1) * itemsPerPage;
    endIndex = startIndex + (itemsPerPage - 1) > numberOfItems ? numberOfItems - 1 : startIndex + (itemsPerPage - 1);
    onPageChange({startIndex: startIndex, endIndex: endIndex});

    // set the new boxes that are rendered
    // always include the first 2 pages
    // always include the current page and its neighbors
    // always include the last two pages
    // insert ellipsis where there is a gap between pages
    let newBoxes = [];
    let ellipsisAdded = false;
    for(let i = 1; i <= numberOfPages; i++) {
      if (i <= 2 || 
          i >= numberOfPages - 1 || 
          Math.abs(i - newPage) <= 1) {
        newBoxes.push(i);
        ellipsisAdded = false;
      } else if (!ellipsisAdded) {
        newBoxes.push("...");
        ellipsisAdded = true;
      }
    }
    setBoxes(newBoxes);
  };

  return <Pagination className="w-[550px] absolute left-[15px] bottom-[15px] justify-start">
    <PaginationContent className="w-full">
      <PaginationItem 
        onClick={() => changePage(page - 1)}
        style={{pointerEvents: page == 1 ? "none" : "initial"}}
        className="cursor-pointer"
        >
        <PaginationPrevious/>
      </PaginationItem>
      {boxes.map((num, index) => {
        if(num == "...") {
          return <PaginationItem key={index}><PaginationEllipsis /></PaginationItem>
        }
        return <PaginationItem key={index}  
                               onClick={() => changePage(num as number)}
                               className="cursor-pointer"
                >
        <PaginationLink isActive={page == num}>
          {num}
        </PaginationLink>
      </PaginationItem>
      })}
      <PaginationItem 
        onClick={() => changePage(page + 1)}
        style={{pointerEvents: page == numberOfPages ? "none" : "initial"}}
        className="cursor-pointer !ml-auto"
      >
        <PaginationNext />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
}