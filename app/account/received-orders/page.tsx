"use client"

import KeysetPagination from "@/app/components/KeysetPagination";
import Dialog from "@/app/components/modals/Dialog";
import Modal from "@/app/components/modals/Modal";
import Order from "@/app/components/Order";
import Search from "@/app/components/Search";
import { userEmitter } from "@/app/layout";
import { OrderData, Orders, OrdersPatch } from "@/app/models/Order";
import { UserData } from "@/app/models/User";
import backendService from "@/app/services/backend.service";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// MENU OPTIONS
const HANDLE_ORDER = "Handle Order"

export default function AccountReceivedOrders() {
  const [orders, setOrders] = useState<Orders>();
  const [orgID, setOrgID] = useState("");
  const [userID, setUserID] = useState("");
  const [handleOrderDialogIsOpen, setHandleOrderDialogIsOpen] = useState(false);
  const [orderHandling, setOrderHandling] = useState<number>();
  const [loadingOrders, setLoadingOrders] = useState(false);

  const router = useRouter();
  const searchRef = useRef<{
    executeSearch: () => void,
    clearSearch: () => void
  } | null>(null);

  const receiveOrders = (data: object) => {
    const dataAsOrders = data as Orders;
    setOrders(dataAsOrders);
  } 

  useEffect(() => {
    userEmitter.on("user", (userEmitted: UserData) => {
      setUserID(userEmitted.id);
      if(userEmitted.organization) {
        setOrgID(userEmitted.organization.id);
      } else {
        router.push("/listings"); // route somewhere else?
      }
    })
  })

  const handleOrder = async (orderID: number | string) => {
    setLoadingOrders(true);
    const body = {
      providerId: userID
    }
    const response = await backendService.patch(`/orders/${orderID}`, body);
    const responseAsOrders = response as OrdersPatch;
    toast(responseAsOrders.message);
    setLoadingOrders(false);
    return responseAsOrders.success;
  }

  const onMenuItemClick = (item: string, order: OrderData) => {
    switch(item) {
      case HANDLE_ORDER:
        setOrderHandling(order.id);
        setHandleOrderDialogIsOpen(true);
        break;
    }
  }

  const onHandleOrderDialogClose = async (confirm: boolean) => {
    if(confirm && orderHandling) {
      setHandleOrderDialogIsOpen(false);
      await handleOrder(orderHandling);
      searchRef.current?.executeSearch();
    }
    setHandleOrderDialogIsOpen(false);
  }

  return <>
  <div className="relative h-full">
    {/**TODO: searchBy, change apiRoute to POOL when fixed */}
    {orgID && <Search 
      apiRoute={`/organizations/${orgID}/orders`} 
      searchBy=""
      receiveResponse={receiveOrders}
      placeholderText="Search Orders"
      loadingResponse={(loading) => setLoadingOrders(loading)}
    />}
    {orders && <>
    <div className="w-full px-[0.75rem] py-[2rem] max-h-[45rem] overflow-y-auto">
      {loadingOrders && <Spinner />}
      {!loadingOrders && orders.data.results.map(order => 
        <Order
          order={order}
          key={order.id}
          menuItems={[HANDLE_ORDER]}
          onMenuItemClick={(item) => onMenuItemClick(item, order)}
          className="mb-[1rem]"
          onStatusClick={() => {
            setOrderHandling(order.id)
            setHandleOrderDialogIsOpen(true)
          }}
        />
      )}
    </div>
    <KeysetPagination 
      hasNextPage={orders.data.hasNextPage}
      hasPreviousPage={orders.data.hasPreviousPage}
      nextCursor={orders.data.nextCursor}
      previousCursor={orders.data.previousCursor}
    />
    </>}
  </div>
  <Modal
    isOpen={handleOrderDialogIsOpen}
    onClose={() => setHandleOrderDialogIsOpen(false)}
  >
    <Dialog 
      text={"Are you sure you'd like to handle this order? It will appear under the \"My Orders\" tab on your profile."}
      header={"Handle Order"}
      onClose={onHandleOrderDialogClose}
    />
  </Modal>
  </>
}