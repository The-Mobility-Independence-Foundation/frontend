"use client";

import { useState } from "react";
import Search from "./components/Search";

export default function Home() {
  const [data, setData] = useState([] as any[]);

  const receiveData = (data: any[]) => {
    // console.log(data)
  };
  const newButtonEvent = (clicked: boolean) => {
    // console.log(clicked)
  };

  return <div className="w-screen h-screen">
    <Search apiRoute="/posts" receiveData={receiveData} newButtonEvent={newButtonEvent} filter={true} />
  </div>;
}
