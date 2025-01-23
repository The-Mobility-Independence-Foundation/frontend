"use client";

import Search from "./components/Search";

export default function Home() {
  const newButtonEvent = (clicked: boolean) => console.log(clicked);

  return <div className="w-screen h-screen">
    <Search apiRoute="/" newButtonEvent={newButtonEvent} filter={true} />
  </div>
}
