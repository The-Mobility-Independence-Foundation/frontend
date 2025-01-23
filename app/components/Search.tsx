"use client";

import Dropdown from "./Dropdown";
import "../styles/search-component.css";
import { ChangeEvent, SetStateAction, SyntheticEvent, useState } from "react";

interface Props {
  placeholderText?: string;
  newButtonText?: string;
  newButtonEvent?: (clicked: boolean) => void;
  filter?: boolean;
}

export default function Search({placeholderText, newButtonText, newButtonEvent, filter}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQueryChange = (event: any) => {
    setSearchQuery(event.target.value);
  }

  const handleNewButtonClick = (event: any) => {
    if(newButtonEvent) {
      newButtonEvent(true);
    }
  }

  return <div 
    className="w-full py-[15px] px-[10%] flex place-content-around"
    style={{backgroundColor: "#D1D5DB"}}
  >
    {newButtonEvent ? 
      <button onClick={handleNewButtonClick}>
        + {newButtonText || "New"}
        </button>
    : ""}
    <div className="flex max-w-[700px] w-[50%]">
      <input 
        type="text" 
        className="border-black w-full"
        placeholder={placeholderText || "Search"}
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      {/* TODO: Icons */}
    </div>
    {filter ?
      <button>
        Filter
      </button>
    : ""}
  </div>
}