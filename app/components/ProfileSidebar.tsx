import { MouseEvent, useEffect, useState } from "react"
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
  const [activeTabY, setActiveTabY] = useState(0);
  const [activeTabHeight, setActiveTabHeight] = useState(0);

  const tabs: Tab[] = [
    {title: "Connections", route: `/account/connections?u_id=${user.id}`},
    {title: "My Orders", route: `/account/my-orders?u_id=${user.id}`},
    {title: "Received Orders", route: `/account/received-orders?u_id=${user.id}`},
    {title: "Settings", route: `/account?u_id=${user.id}`}
  ];
  // TODO: organization data

  const setActiveTabStyles = (y: number, height: number) => {
    setActiveTabY(y);
    setActiveTabHeight(height);
  }

  const clickTab = (event: MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const parent = element.parentElement;
    if(element && parent) {
      const elementRect = element.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      setActiveTabStyles(elementRect.top - parentRect.top, elementRect.height);
    }
  }
  
  return <div className="h-full w-min flex flex-col justify-between bg-[#DDEDFF] drop-shadow-md">
    <div className="m-[1rem]">
      <h2 className="text-nowrap">{user.firstName} {user.lastName}</h2>
      <p>@{user.displayName}</p>
      <p>{user.email}</p>
      <div className="bg-[#002856] text-white rounded-xl drop-shadow-md text-center my-1 py-1">ORGANIZATION</div>
    </div>

    <div className="relative p-[1rem]">
      {tabs.map(tab => 
        <div 
          className="w-full p-1 my-3 cursor-pointer hover:opacity-50 transition-opacity duration-100" 
          key={tab.route}
          onClick={(event) => clickTab(event)}
        >
            <h5 className="text-right">{tab.title}</h5>
        </div>
      )}
      <div
        className="bg-transparent transition-all duration-300 
          ease-in-out absolute left-0 w-full
          border-r-[5px] border-r-[#002856] 
          border-t-[1px] border-t-[#bdd8f6] border-b-[1px] border-b-[#bdd8f6]"
        style={{
          top: `${activeTabY}px`,
          height: `${activeTabHeight}px`
        }}
      />
    </div>
    
    <div className="m-[1rem]">
      <p className="font-medium">Last Activity:</p>
      <p className="text-xl">{new Date(user.lastActivity).toLocaleString()}</p>
    </div>
  </div>
}