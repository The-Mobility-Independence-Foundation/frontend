"use client";

import Dropdown from "./Dropdown";
import "../styles/search-component.css";
import { ChangeEvent, SetStateAction, SyntheticEvent, useState } from "react";

interface Props {
  placeholderText?: string;
  newButtonText?: string;
}

export default function Search({placeholderText, newButtonText}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQueryChange = (event: any) => {
    setSearchQuery(event.target.value);
  }

  return <div 
    className="w-full py-[15px] px-[10%] flex place-content-around"
    style={{backgroundColor: "#D1D5DB"}}
  >
    {newButtonText ? <button>+ {newButtonText}</button> : ""}
    {/* <button>+ {newButtonText}</button> */}
    <div className="flex max-w-[700px] w-[60%]">
      <input 
        type="text" 
        className="border-black w-full"
        placeholder={placeholderText || "Search"}
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      {/* TODO: Icons */}
    </div>
  </div>
}