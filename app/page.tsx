"use client";

import PaginationComponent, { PageChangeEvent } from "./components/Pagination";

export default function Home() {
  const onPageChange = (event: PageChangeEvent) => {
    // console.log(event);
  }

  return <div className="w-screen h-screen">
    <PaginationComponent numberOfItems={880} itemsPerPage={10} onPageChange={async (event) => onPageChange(event)} />
  </div>
}
