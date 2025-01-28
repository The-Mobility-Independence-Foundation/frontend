"use client";

import Pagination from "./components/Pagination";
import { PageChangeEvent } from "./components/Pagination";

export default function Home() {
  const onPageChange = (event: PageChangeEvent) => {
    console.log(event);
  }

  return <div className="w-screen h-screen">
    <Pagination numberOfItems={880} itemsPerPage={10} onPageChange={async (event) => onPageChange(event)} />
  </div>
}
