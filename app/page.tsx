"use client";

import Pagination from "./components/Pagination";
import { PageChangeEvent } from "./components/Pagination";

export default function Home() {
  const onPageChange = (event: PageChangeEvent) => {
    // TODO: function call is beheind
    console.log(event);
  }

  return <div className="w-screen h-screen">
    <Pagination numberOfItems={888} itemsPerPage={10} onPageChange={async (event) => onPageChange(event)} />
  </div>
}
