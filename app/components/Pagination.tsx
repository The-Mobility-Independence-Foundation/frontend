"use client";

import "../styles/pagination-component.css";

interface Props {
  numberOfItems: number;
  itemsPerPage: number;
}

export default function Pagination({numberOfItems, itemsPerPage}: Props) {
  // default page data
  let startIndex = 0;
  let endIndex = numberOfItems < itemsPerPage ? numberOfItems-1 : itemsPerPage-1;
  let page = 1;

  const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);
  let boxes: (number | string)[] = numberOfPages > 5 
    ? [1, 2, "...", numberOfPages-1, numberOfPages]
    : Array.from({length: numberOfPages}, (_, index) => index + 1);

  return <div className="flex">
    <div className="box arrow">
      <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 4L9 11L4.5 7.5L9 4Z" fill="currentColor"></path></svg>
    </div>
    {boxes.map(num => {
      if(num == "...") {
        return <div className="relative mr-[5px] ml-[5px] mt-[3px] text-[20px] text-center font-semibold h-[40px] w-[18px]">
          <span className="absolute bottom-0 left-0">{num}</span>
        </div>;
      }
      return <div className="box"
                  style={{backgroundColor: num == page ? "#EBEBEB" : "white"}}>
                    {num}
              </div>;
      })
    }
    <div className="box arrow">
      <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 11L6 4L10.5 7.5L6 11Z" fill="currentColor"></path></svg>
    </div>
  </div>
}