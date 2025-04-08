"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"
// import backendService from "../services/backend.service";
import { UserData } from "../models/User";
// import { toast } from "sonner";
import { userEmitterBus } from "../layout";

interface LinkReference {
  route: string;
  title: string;
  base: string;
}

export default function Header() {
  const [hasMessages, setHasMessages] = useState(false);
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      setUser(userEmitted);
    })
  })

  const pathName = usePathname();

  // URLS
  const PUBLIC_LISTINGS = "/listings";
  // const FORUM = "/forum";
  const PRIVATE_MESSAGES = `/messages`;
  const INVENTORIES = `/inventories`;
  const MY_LISTINGS = `/my-listings`;
  const ACCOUNT = `/account`;

  const links: LinkReference[] = [
    {route: PUBLIC_LISTINGS, title: "Public Listings", base: PUBLIC_LISTINGS.split("?")[0]},
    // {route: FORUM, title: "Forum", base: FORUM.split("?")[0]},
    {route: PRIVATE_MESSAGES, title: "Private Messages", base: PRIVATE_MESSAGES.split("?")[0]},
    {route: INVENTORIES, title: "My Inventories", base: INVENTORIES.split("?")[0]},
    {route: MY_LISTINGS, title: "My Listings", base: MY_LISTINGS.split("?")[0]},
  ];

  const backendUnreadMessages = () => {
    // TODO: uncomment this when backend is hooked up
    // const apiRoute = `/conversations`;
    // const filters = ["read=null"];
    // backendService.get(apiRoute, filters)
    //   .then(response => {
        // setHasMessages(response.data?.length > 0);
    //   }
    // )
    setHasMessages(false)
  };

  setInterval(() => {
    backendUnreadMessages();
  }, 10000); // check for messages every 10 seconds

  return <div className="bg-[#002856] py-[1rem] w-full flex justify-around items-center font-bold text-white text-xs h-[85px] lg:h-[90px] 2xl:h-[120px]">
    <Link
      href="/listings"
      className="w-[20%] relative"
    >
      <Image 
        src="/assets/Header Logo.png" 
        alt={`"The MIF Foundation" company logo`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"        className="!relative"
        priority
      />
    </Link>
    <nav className="space-x-[1rem] flex flex-nowrap overflow-x-scroll">
      {links.map(link => 
      <div 
        key={link.title}
        className="flex items-center"
      >
        <Link 
          href={link.route}
          className={`${pathName.split("?")[0] == link.base ? "text-[#009D4F]" : ""} 
                      whitespace-nowrap lg:text-lg`}
        >{link.title}</Link>
        <span
          className={`text-red-600 ml-[0.2rem] text-xl lg:text-3xl ${link.route == PRIVATE_MESSAGES && hasMessages ? "opacity-100" : "opacity-0"}`}
        >!</span>
      </div>
      )}
    </nav>
    <Link 
      href={ACCOUNT}
      className={`${pathName.startsWith(ACCOUNT.split("?")[0]) ? "text-[#009D4F]" : "text-white"} lg:text-lg`}
    >Account</Link>
  </div>
}