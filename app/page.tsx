"use client"

import PaginationComponent, { PageChangeEvent } from "./components/Pagination";

export default function Home() {
  const onPageChange = (event: PageChangeEvent) => {
    console.log(event);
  }

  return <div className="w-screen h-screen">
    <PaginationComponent count={50} total={1000} hasNext={true} nextToken={251} onPageChange={async (event) => onPageChange(event)} />
  </div>
}
