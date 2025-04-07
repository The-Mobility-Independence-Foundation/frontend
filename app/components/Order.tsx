"use client"

import Link from "next/link";
import { OrderData, OrderStatus } from "../models/Order";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import { capitalize } from "../models/Listings";

interface OrderProps {
  order: OrderData;
  menuItems: string[];
  userID: string | number;
  onMenuItemClick: (item: string) => void;
  className?: string;
  statusOverride?: string;
  onStatusClick?: (status: string) => void;
}

export default function Order({order, menuItems, userID, onMenuItemClick, className, statusOverride, onStatusClick}: OrderProps) {
  const [statusStyle, setStatusStyle] = useState("");

  const madeOrder = order.recipient.id == userID;

  useEffect(() => {
    if(order.status) {
      switch(order.status.toLowerCase()) {
        case OrderStatus.INITIATED:
          setStatusStyle(`bg-[#28A745] text-white`);
          break;
        case OrderStatus.FULLFILLED:
          setStatusStyle(`bg-[#007BFF] text-white`);
          break;
        case OrderStatus.PENDING:
          setStatusStyle(`bg-[#FFC107] text-white`);
          break;
        case OrderStatus.VOIDED:
          setStatusStyle(`bg-[#6C757D] text-white`);
          break;
        default:
          setStatusStyle(`bg-white text-black`);
      }
    }
  }, [order]);
  
  return <div
      className={`flex justify-between flex-wrap w-full bg-[#F4F4F5] drop-shadow-md rounded-sm px-[1rem] py-[0.75rem] ${className}`}
  >
    <div className="flex flex-col">
      <Link href={`/listing?listing_id=${order.listing.id}`}>
        <h4 className="hover:underline cursor-pointer">{order.listing.name}</h4>      
      </Link>
      <h5>{order.listing.description}</h5>
      <p className="mt-[revert]">{order.listing.inventoryItem?.part?.name}</p>
      <p className="mt-auto italic font-bold border rounded w-min border-black p-[0.2rem]">{madeOrder ? "Sent" : "Handeling"}</p>
    </div>
    <div
      className="flex flex-col justify-between mr-[5rem] ml-[2rem]
                max-sm:mr-[0rem] max-sm:my-[1rem]"
    >
      {madeOrder ? <>{order.provider && <>
        <h5>{order.provider.firstName} {order.provider.lastName}</h5>
        <div>
          {order.provider && 
            <p>@{order.provider.displayName}</p>          
          }
          <p>{order.provider.email}</p>
        </div>
        <Link href={`/messages?u_id=${order.provider?.id}`} className="w-full">
          <button className="w-full button">Message</button>{" "}
          {/**TODO: routes to specified user pv */}
        </Link>
        </>}</> : <>
        <h5>{order.recipient.firstName} {order.recipient.lastName}</h5>
        <div>
          <p>@{order.recipient.displayName}</p>
          <p>{order.recipient.email}</p>
        </div>
        <Link href={`/messages?u_id=${order.recipient.id}`} className="w-full">
          <button className="w-full button">Message</button>{" "}
          {/**TODO: routes to specified user pv */}
        </Link>
      </>}
    </div>
    <div className="flex flex-col justify-around items-center my-[1rem]">
        <div className="text-center">
          <p>Quantity Ordered:</p>
          <h5>{order.quantity}</h5>
        </div>
        <div className="text-center">
          <p>Date Ordered:</p>
          <h5>{new Date(order.dateCreated).toLocaleDateString()}</h5>
        </div>
    </div>
    {order.status && 
      <div className="flex flex-col">
        <div
          className={`mt-auto p-2 rounded font-bold border-2 border-[#00000026] ${statusStyle} ${onStatusClick ? "cursor-pointer" : ""}`}
          onClick={() => {if(onStatusClick)onStatusClick(order.status)}}
        >{statusOverride || capitalize(order.status)}</div>
      </div>
    }
    {menuItems.length > 0 && 
      <Menu 
        items={menuItems} 
        onItemClick={onMenuItemClick} 
        className="fixed !top-2 !right-4 sm:top-0 sm:right-0 xl:top-2 xl:right-4"
      />}
  </div>
}