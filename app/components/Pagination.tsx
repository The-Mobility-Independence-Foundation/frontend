"use client";

import { useState } from "react";
import "../styles/pagination-component.css";

export interface PageChangeEvent {
  startIndex: number;
  endIndex: number;
}

interface Props {
  numberOfItems: number;
  itemsPerPage: number;
  onPageChange: (event: PageChangeEvent) => {};
}

export default function Pagination({numberOfItems, itemsPerPage, onPageChange}: Props) {
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
    let newBoxes = [];
    let ellipsisAdded = false;
    for(let i = 1; i <= numberOfPages; i++) {
      if(i == 1 || i == 2) {
        newBoxes.push(i);
        ellipsisAdded = false;
      } else if(i == newPage - 1 || i == newPage || i == newPage + 1) {
        newBoxes.push(i);
        ellipsisAdded = false;
      } else if(i == numberOfPages - 1 || i == numberOfPages) {
        newBoxes.push(i);
        ellipsisAdded = false;
      } else if(!ellipsisAdded) {
        newBoxes.push("...");
        ellipsisAdded = true;
      }
    }
    setBoxes(newBoxes);
  };

  // TODO: make it appear at bottom of page no matter what
  return <div className="flex">
    <div className="box" style={{pointerEvents: page == 1 ? "none" : "initial"}}
         onClick={() => changePage(page - 1)}>
      <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 4L9 11L4.5 7.5L9 4Z" fill="currentColor"></path></svg>
    </div>
    {boxes.map((num, index) => {
      if(num == "...") {
        return <div key={"ellipsis-" + index} className="relative mr-[5px] ml-[5px] mt-[3px] text-[20px] text-center font-semibold h-[40px] w-[18px]">
          <span className="absolute bottom-0 left-0">{num}</span>
        </div>;
      }
      return <div className="box" key={num}
                  style={{backgroundColor: num == page ? "#EBEBEB" : "white", pointerEvents: page == num ? "none" : "initial"}}
                  onClick={() => changePage(num as number)}>
                    {num}
              </div>;
      })
    }
    <div className="box" style={{pointerEvents: page == numberOfPages ? "none" : "initial"}}
         onClick={() => changePage(page + 1)}>
      <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 11L6 4L10.5 7.5L6 11Z" fill="currentColor"></path></svg>
    </div>
  </div>
}