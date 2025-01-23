"use client";

import Image from 'next/image';
import "../styles/search-component.css";
import { ChangeEvent, SetStateAction, SyntheticEvent, useState } from "react";

interface Props {
  apiRoute: string;
  placeholderText?: string;
  newButtonText?: string;
  newButtonEvent?: (clicked: boolean) => void;
  filter?: boolean;
}

export default function Search({apiRoute, placeholderText, newButtonText, newButtonEvent, filter}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQueryChange = (event: any) => {
    setSearchQuery(event.target.value);
  }

  const handleNewButtonClick = (event: any) => {
    if(newButtonEvent) {
      newButtonEvent(true);
    }
  }

  // TODO: API route hook up -> sends information back to parent
  // TODO: Add filter component once finished

  return <div 
    className="w-full py-[15px] px-[10%] flex place-content-around"
    style={{backgroundColor: "#D1D5DB"}}
  >
    {newButtonEvent ? 
      <button onClick={handleNewButtonClick}>
        + {newButtonText || "New"}
        </button>
    : ""}
    <div className="flex max-w-[700px] w-[50%] relative items-center">
      <input 
        type="text" 
        className="border-black w-full"
        placeholder={placeholderText || "Search"}
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      <Image 
        src="/images/search.svg"
        height={35}
        width={35}
        alt="Search"
        className="absolute right-[5px]"
      />
    </div>
    {filter ?
      <button>
        Filter
      </button>
    : ""}
  </div>
}