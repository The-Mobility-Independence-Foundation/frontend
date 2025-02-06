import { NavLink } from "react-router-dom";

interface Link {
  route: string;
  title: string;
}

export default function Header() {
  const userID = 1;

  const links: Link[] = [
    {route: "/listings", title: "Public Listings"},
    {route: "/forum", title: "Forum"},
    {route: `/messages/${userID}`, title: "Private Messages"},
    {route: `/inventories/${userID}`, title: "My Inventories"},
    {route: `/listings/${userID}`, title: "My Listings"},
  ]

  return <div className="bg-[#002856] py-[0.5rem] w-full flex justify-around items-center font-bold text-white text-xs">
    <img src="/assets/Header Logo.png" alt="logo" className="w-[20%]"></img>
    <nav className="space-x-[1rem]">
      {links.map(link => 
        <NavLink 
          to={link.route}
          className={({ isActive }) => 
            isActive ? "text-[#009D4F]" : "text-white"
          }
        >{link.title}</NavLink>
      )}
    </nav>
    <a href="/account">Account</a>
  </div>
}