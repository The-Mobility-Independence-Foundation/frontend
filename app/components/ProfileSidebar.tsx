"use client"

import { useEffect, useState } from "react"
import { UserData } from "../models/User"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { userEmitter } from "../layout";

interface Tab {
  title: string,
  route: string
}

export default function ProfileSidebar() {
  const [user, setUser] = useState<UserData>();
  const [activePath, setActivePath] = useState<string>(`${usePathname()}`);
  const [activeElementY, setActiveElementY] = useState(0);
  const [activeElementHeight, setActiveElementHeight] = useState(0);
  const [appearing, setAppearing] = useState(true);

  useEffect(() => {
    userEmitter.on("user", (userEmitted: UserData) => {
      setUser(userEmitted);
    })
  })

  const router = useRouter();
  const tabs: Tab[] = [
    {title: "Connections", route: `/account/connections`},
    {title: "My Orders", route: `/account/my-orders`},
    {title: "Received Orders", route: `/account/received-orders`},
    {title: "Settings", route: `/account`}
  ];

  useEffect(() => {
    const element = document.getElementById(activePath);
    if(element) {
      const parent = element.parentElement;
      if(parent) {
        const elementRect = element.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        setActiveElementY(elementRect.top - parentRect.top);
        setActiveElementHeight(elementRect.height);
      }
    }
  }, [activePath, user]);

  const clickTab = (route: string) => {
    router.push(route);
    setActivePath(route);
  }
  
  return <>{user && 
    <div className={`z-10 relative ${appearing ? "animate-slideIn" : "animate-slideOut"}`}>
      <div className={`h-full flex flex-col justify-between bg-[#DDEDFF] drop-shadow-md ${appearing ? "w-min" : "w-0 p-0 overflow-hidden"}`}>
        <div className="m-[1rem]">
          <h2 className="text-nowrap">
            {user.firstName} {user.lastName}
          </h2>
          <p>@{user.displayName}</p>
          <p>{user.email}</p>
          {user.organization && 
          <div className="bg-[#002856] text-white rounded-xl drop-shadow-md text-center my-1 py-1">
            {user.organization.name}
          </div>
          }
        </div>

        <div className="relative p-[1rem]">
          {tabs.map((tab) => (
            <div
              className="w-full p-1 my-3 cursor-pointer hover:opacity-50 transition-opacity duration-100"
              key={tab.title}
              id={tab.route}
              onClick={() => clickTab(tab.route)}
            >
              <h5 className="text-right">{tab.title}</h5>
            </div>
          ))}
          <div
            className="bg-transparent transition-all duration-300 
          ease-in-out absolute left-0 w-full
          border-r-[5px] border-r-[#002856] 
          border-t-[1px] border-t-[#bdd8f6] border-b-[1px] border-b-[#bdd8f6]"
            style={{
              top: `${activeElementY}px`,
              height: `${activeElementHeight}px`,
            }}
          />
        </div>

        <div className="m-[1rem]">
          <p className="font-medium">Last Activity:</p>
          <p className="text-xl">
            {new Date(user.lastActivity).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="absolute z-50 right-[-40px] top-[10px]">
        <svg 
            width="30" 
            height="30" 
            viewBox="0 0 15 15" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="ml-auto cursor-pointer"
            onClick={() => setAppearing(!appearing)}
          >
            <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
          </svg>
      </div>
    </div>}</>;
}