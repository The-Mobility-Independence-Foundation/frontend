"use client"

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

interface LinkReference {
  route: string;
  title: string;
}

export default function Header() {
  const userID = 1; // TODO: replace with real User ID

  // URLS
  const PUBLIC_LISTINGS = "/listings";
  const FORUM = "/forum";
  const PRIVATE_MESSAGES = `/messages?u_id=${userID}`;
  const INVENTORIES = `/inventories?u_id=${userID}`;
  const MY_LISTINGS = `/listings/${userID}`;
  const ACCOUNT = "/account";

  const links: LinkReference[] = [
    {route: PUBLIC_LISTINGS, title: "Public Listings"},
    {route: FORUM, title: "Forum"},
    {route: PRIVATE_MESSAGES, title: "Private Messages"},
    {route: INVENTORIES, title: "My Inventories"},
    {route: MY_LISTINGS, title: "My Listings"},
  ];

  const basePath = usePathname();
  const params = useSearchParams();
  const path = `${basePath}${params.size > 0 ? `?${params.toString()}` : ""}`;
  const [hasMessages, setHasMessages] = useState(false);

  const backendUnreadMessages = () => {
    const apiRoute = `/conversations`;
    const filters = ["read=null"];
    // TODO: uncomment this when backend is hooked up
    // backendService.get(apiRoute, filters)
    //   .then(response => {
    //     setHasMessages(response.data?.length > 0);
    //   }
    // )
  };

  setInterval(() => {
    backendUnreadMessages();
  }, 10000); // check for messages every 10 seconds

  return <div className="bg-[#002856] py-[1rem] w-full flex justify-around items-center font-bold text-white text-xs">
    <Link
      href="/listings"
      className="w-[20%]"
    ><img src="/assets/Header Logo.png" alt={`"The MIF Foundation" company logo`}></img>
    </Link>
    <nav className="space-x-[1rem] flex flex-nowrap overflow-x-scroll">
      {links.map(link => 
      <div 
        key={link.route}
        className="flex items-center"
      >
        <Link 
          href={link.route}
          className={`${path == link.route ? "text-[#009D4F]" : ""} whitespace-nowrap lg:text-lg`}
        >{link.title}</Link>
        <span
          className={`text-red-600 ml-[0.2rem] text-xl lg:text-3xl ${link.route == PRIVATE_MESSAGES && hasMessages ? "opacity-100" : "opacity-0"}`}
        >!</span>
      </div>
      )}
    </nav>
    <Link 
      href={ACCOUNT}
      className={`${path == ACCOUNT ? "text-[#009D4F]" : "text-white"} lg:text-lg`}
    >Account</Link>
  </div>
}