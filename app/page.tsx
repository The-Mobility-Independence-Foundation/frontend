"use client";

import Pagination from "./components/Pagination";
import Search from "./components/Search";

export default function Home() {
  const newButtonEvent = (clicked: boolean) => console.log(clicked);

  return <div className="w-screen h-screen">
    <Pagination numberOfItems={890} itemsPerPage={10} />
  </div>
}
