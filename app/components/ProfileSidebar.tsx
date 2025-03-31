import { useEffect, useState } from "react"
import { OrganizationData } from "../models/Organization"
import { UserData } from "../models/User"
import Link from "next/link";

interface ProfileSidebarProps {
  user: UserData,
  // organization: OrganizationData
}

interface Tab {
  title: string,
  route: string
}

export default function ProfileSidebar({user}: ProfileSidebarProps) {
  const tabs: Tab[] = [
    {title: "Connections", route: `/account/connections?u_id=${user.id}`},
    {title: "My Orders", route: `/account/my-orders?u_id=${user.id}`},
    {title: "Received Prders", route: `/account/received-orders?u_id=${user.id}`},
    {title: "Settings", route: `/account/settings?u_id=${user.id}`}
  ];
  // TODO: organization data
  
  return <div className="h-full w-min flex flex-col justify-between bg-[#DDEDFF] drop-shadow-md p-[1rem]">
    <div>
      <h2 className="text-nowrap">{user.firstName} {user.lastName}</h2>
      <p>@{user.displayName}</p>
      <p>{user.email}</p>
      <div className="bg-[#002856] text-white rounded-xl drop-shadow-md text-center my-1 py-1">ORGANIZATION</div>
    </div>

    <div>
      {tabs.map(tab => 
        <Link 
          className="w-full p-1 my-3 cursor-pointer" 
          key={tab.route}
          href={tab.route}
        >
            <h5 className="text-right">{tab.title}</h5>
        </Link>
      )}
    </div>
    
    <div>
      <p className="font-medium">Last Activity:</p>
      <p className="text-xl">{new Date(user.lastActivity).toLocaleString()}</p>
    </div>
  </div>
}