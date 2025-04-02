"use client"

import KeysetPagination from "@/app/components/KeysetPagination";
import Order from "@/app/components/Order";
import Search from "@/app/components/Search";
import { Orders } from "@/app/models/Order";
import { useEffect, useState } from "react";

export default function AccountMyOrders() {
  const [orders, setOrders] = useState<Orders>();

  const receiveOrders = (data: object) => {
    const dataAsOrders = data as Orders;
    setOrders(dataAsOrders);
  } 

  useEffect(() => { // TODO: for testing, remove after hookup
    receiveOrders({
        message: "Success",
        success: true,
        data: {
          results: [{
            id: 1,
            inventoryItem: {
              id: 1,
              name: "Item",
              part: {
                id: 1,
                name: "Part",
                model: "",
                description: "",
                partNumber: "sudnbhg",
                partType: "Part Type"
              },
              model: {
                name: "Model",
                year: 2025,
                id: 1
              },
              quantity: 50,
              publicCount: 50,
              notes: "Notes",
              attributes: { "Attribute 1": "attr" }
            },
            vendor: {
              id: 1,
              firstName: "First",
              lastName: "Last",
              email: "example@example.com",
              displayName: "Display Name",
              type: "admin"
            },
            quantity: 25,
            createdAt: "November 25th 2001",
            status: "Initiated"
          }],
          hasNextPage: false,
          hasPreviousPage: false,
          nextCursor: null,
          previousCursor: null
        }
    })
  }, [])

  return <>{orders && <div className="relative h-full">
    {/**TODO: API route & searchBy */}
    {/**TODO: filter */}
    <Search 
      apiRoute="" 
      searchBy=""
      receiveResponse={receiveOrders}
      placeholderText="Search Orders"
    />
    <div className="w-full px-[0.5rem] py-[2rem] max-h-[45rem] overflow-y-auto
    ">
      {orders.data.results.map(order => 
        <Order
          order={order}
          key={order.id}
        />
      )}
    </div>
    <KeysetPagination 
      hasNextPage={orders.data.hasNextPage}
      hasPreviousPage={orders.data.hasPreviousPage}
      nextCursor={orders.data.nextCursor}
      previousCursor={orders.data.previousCursor}
    />
  </div>}</>
}