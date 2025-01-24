"use client";

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
    {boxes.map(num => {
      if(num == "...") {
        return <div className="relative mr-[5px] ml-[5px] mt-[3px] text-[20px] text-center font-semibold h-[40px] w-[18px]">
          <span className="absolute bottom-0 left-0">{num}</span>
        </div>;
      }
      return <div className="m-[3px] text-[#757575] text-[20px] font-semibold w-[40px] h-[40px] rounded-[3px]
                  flex items-center place-content-around"
                  style={{border: "solid 1px #D1D1D1", backgroundColor: num == page ? "#EBEBEB" : "white"}}>
                    {num}
              </div>;
      })
    }
  </div>
}