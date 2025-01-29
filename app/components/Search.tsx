"use client";

import "../styles/search-component.css";
import { useState } from "react";

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
      <svg className="absolute right-[5px]" width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
      </svg>
    </div>
    {filter ?
      <button>
        Filter
      </button>
    : ""}
  </div>
}