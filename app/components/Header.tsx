"use client"

import Link from "next/link";
import { useRouter } from "next/router";

interface Link {
  route: string;
  title: string;
}

export default function Header() {
  const userID = 1;
  // TODO: fix useRouter
  // const router = useRouter();

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
          // className={router.pathname == link.route ? "text-[#009D4F]" : "text-white"}
          key={link.route}
        >{link.title}</Link>
      )}
    </nav>
    <Link 
          href="/account"
          // className={router.pathname == "/account" ? "text-[#009D4F]" : "text-white"}
        >Account</Link>
    <a href="/account">Account</a>
  </div>
}