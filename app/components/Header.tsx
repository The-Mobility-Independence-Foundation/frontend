"use client"

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"
import backendService from "../services/backend.service";
import { User, UserData } from "../models/User";
import { toast } from "sonner";

interface LinkReference {
  route: string;
  title: string;
}

// TODO: highlight "Public Listings" with query parameters (should work with all links)
export default function Header() {
  const [user, setUser] = useState<UserData>();

  const router = useRouter();
  useEffect(() => {
    backendService.get("/users/@me")
    .then(response => {
      const responseAsUser = response as User;
      if(!responseAsUser.success) {
        toast(responseAsUser.message);
        router.push("/landing");
        return;
      }
      setUser(responseAsUser.data);
    });
  })
  
  const orgID = 1; // TODO: replace with real org id

  // URLS
  const PUBLIC_LISTINGS = "/listings";
  const FORUM = "/forum";
  const PRIVATE_MESSAGES = `/messages?u_id=${user?.id}`;
  const INVENTORIES = `/inventories?org_id=${orgID}`;
  const MY_LISTINGS = `/listings/${user?.id}`;
  const ACCOUNT = `/account?u_id=${user?.id}`;

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

  return <div className="h-min bg-[#002856] py-[1rem] w-full flex justify-around items-center font-bold text-white text-xs">
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
      {/* <img src="/assets/Header Logo.png" alt={`"The MIF Foundation" company logo`}></img> */}
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