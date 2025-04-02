import Link from "next/link";
import { OrderData } from "../models/Order";

interface OrderProps {
  order: OrderData;
  className?: string;
}

export default function Order({order, className}: OrderProps) {
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
    <div className="flex flex-col justify-around items-center
    my-[1rem]">
        <div className="text-center">
          <p>Quantity Ordered:</p>
          <h5>{order.quantity}</h5>
        </div>
        <div className="text-center">
          <p>Date Ordered:</p>
          <h5>{order.createdAt}</h5>
        </div>
    </div>
    <div>
      {/**TODO: menu & status */}
    </div>
  </div>
}