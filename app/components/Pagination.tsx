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
  startIndex: number;
  endIndex: number;
}

interface Box {
  value: number | string;
  id: string;
}

interface Props {
  count: number;
  total: number;
  hasNext: boolean;
  nextToken: number;
  onPageChange: (event: PageChangeEvent) => {};
}

export default function PaginationComponent({count, total, hasNext, nextToken, onPageChange}: Props) {
  // default page data
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(total < count ? total-1 : count-1);
  const [page, setPage] = useState(1);
  const numberOfPages = Math.ceil(total / count);
  const [boxes, setBoxes] = useState(numberOfPages > 5 
    ? [{value: 1, id: uuidv4()}, {value: 2, id: uuidv4()}, {value: "...", id: uuidv4()}, {value: numberOfPages-1, id: uuidv4()}, {value: numberOfPages, id: uuidv4()}]
    : Array.from({length: numberOfPages}, (_, index) => {return {value: index+1, id: uuidv4()}}));

  const changePage = (newPage: number) => {
    // Set the new item indices
    setPage(newPage);
    setStartIndex((newPage - 1) * count);
    setEndIndex(startIndex + (count - 1) > total ? total - 1 : startIndex + (count - 1));
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
        newBoxes.push({value: i, id: uuidv4()});
        ellipsisAdded = false;
      } else if (!ellipsisAdded) {
        newBoxes.push({value: "...", id: uuidv4()});
        ellipsisAdded = true;
      }
    }
    setBoxes(newBoxes);
  };

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