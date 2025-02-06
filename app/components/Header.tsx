"use client"

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface Link {
  route: string;
  title: string;
}

export default function Header() {
  const userID = 1;
  const basePath = usePathname();
  const params = useSearchParams();
  const path = `${basePath}${params.size > 0 ? `?${params.toString()}` : ""}`;
  // TODO: reformat view for tablet/phone

  const links: Link[] = [
    {route: "/listings", title: "Public Listings"},
    {route: "/forum", title: "Forum"},
    {route: `/messages?u_id=${userID}`, title: "Private Messages"},
    {route: `/inventories?u_id=${userID}`, title: "My Inventories"},
    {route: `/listings?u_id=${userID}`, title: "My Listings"},
  ]

  return <div className="bg-[#002856] py-[0.5rem] w-full flex justify-around items-center font-bold text-white text-xs">
    <img src="/assets/Header Logo.png" alt="logo" className="w-[20%]"></img>
    <nav className="space-x-[1rem]">
      {links.map(link => 
        <Link 
          href={link.route}
          className={path == link.route ? "text-[#009D4F]" : "text-white"}
          key={link.route}
        >{link.title}</Link>
      )}
    </nav>
    <Link 
      href="/account"
      className={path == "/account" ? "text-[#009D4F]" : "text-white"}
    >Account</Link>
  </div>
}