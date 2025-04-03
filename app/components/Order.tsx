"use client"

import Link from "next/link";
import { OrderData } from "../models/Order";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import { capitalize } from "../models/Status";

interface OrderProps {
  order: OrderData;
  statusChangeMenu?: boolean;
  hideStatus?: boolean;
  className?: string;
}

// STATUSES
export const INITIATED = "initiated";
export const FULLFILLED = "fullfilled";
export const PENDING = "pending";
export const VOIDED = "voided";

export default function Order({order, statusChangeMenu, hideStatus, className}: OrderProps) {
  const [statusStyle, setStatusStyle] = useState("");
  const [orderMenuOptions, setOrderMenuOptions] = useState<string[]>([]);

  const menuItemTemplate = "Mark as ";

  useEffect(() => {
    switch(order.status.toLowerCase()) {
      case INITIATED:
        setStatusStyle(`bg-[#007BFF] text-white`);
        setOrderMenuOptions([
          `${menuItemTemplate}${capitalize(PENDING)}`,
          `${menuItemTemplate}${capitalize(FULLFILLED)}`,
          `${menuItemTemplate}${capitalize(VOIDED)}`
        ]);
        break;
      case FULLFILLED:
        setStatusStyle(`bg-[#28A745] text-white`);
        break;
      case PENDING:
        setStatusStyle(`bg-[#FFC107] text-white`);
        setOrderMenuOptions([
          `${menuItemTemplate}${capitalize(FULLFILLED)}`,
          `${menuItemTemplate}${capitalize(VOIDED)}`
        ]);
        break;
      case VOIDED:
        setStatusStyle(`bg-[#6C757D] text-white`);
        break;
      default:
        setStatusStyle(`bg-white text-black`);
    }
  }, [order]);

  const onMenuItemClick = (item: string) => {
    const newStatus = item.split(menuItemTemplate)[1].toLowerCase();
    // TODO: API call for changing an order status
  }
  
  return <div
      className={`flex justify-between flex-wrap w-full bg-[#F4F4F5] drop-shadow-md rounded-sm px-[1rem] py-[0.75rem] ${className}`}
  >
    <div>
      <h4 className="hover:underline">{order.inventoryItem.name}</h4>
      <h5>{order.inventoryItem.part.partNumber}</h5>
      <p className="mt-[revert]">{order.inventoryItem.model.name}</p>
      <p>{order.inventoryItem.part.partType}</p>
    </div>
    <div
      className="flex flex-col justify-between mr-[5rem] ml-[2rem]
                max-sm:mr-[0rem] max-sm:my-[1rem]"
    >
      <h5>{order.vendor.firstName} {order.vendor.lastName}</h5>
      <div>
        <p>@{order.vendor.displayName}</p>
        <p>{order.vendor.email}</p>
      </div>
      <Link href={`/messages?u_id=${order.vendor.id}`} className="w-full">
        <button className="w-full button">Message</button>{" "}
        {/**TODO: routes to specified user pv */}
      </Link>
    </div>
    <div className="flex flex-col justify-around items-center my-[1rem]">
        <div className="text-center">
          <p>Quantity Ordered:</p>
          <h5>{order.quantity}</h5>
        </div>
        <div className="text-center">
          <p>Date Ordered:</p>
          <h5>{order.createdAt}</h5>
        </div>
    </div>
    {!hideStatus && 
      <div className="flex flex-col">
        <div
          className={`mt-auto p-2 rounded font-bold border-2 border-[#00000026] ${statusStyle}`}
        >{capitalize(order.status)}</div>
      </div>
    }
    {statusChangeMenu && orderMenuOptions.length > 0 && 
      <Menu 
        items={orderMenuOptions} 
        onItemClick={onMenuItemClick} 
        className="fixed !top-2 !right-4 sm:top-0 sm:right-0 xl:top-2 xl:right-4"
      />}
  </div>
}