"use client";

import KeysetPagination from "@/app/components/KeysetPagination";
import Dialog from "@/app/components/modals/Dialog";
import Modal from "@/app/components/modals/Modal";
import Order from "@/app/components/Order";
import Search from "@/app/components/Search";
import { userEmitterBus } from "@/app/layout";
import { Orders, OrdersPatch, OrderStatus } from "@/app/models/Order";
import { capitalize } from "@/app/models/Listings";
import { UserData } from "@/app/models/User";
import backendService from "@/app/services/backend.service";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function AccountMyOrders() {
  const [orders, setOrders] = useState<Orders>();
  const [userID, setUserID] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderStatusDialogIsOpen, setOrderStatusDialogIsOpen] = useState(false);
  const [orderAndStatusSelected, setOrderAndStatusSelected] = useState<{
    orderID: number | string;
    status: string;
  }>();

  const searchRef = useRef<{
    executeSearch: () => void;
    clearSearch: () => void;
  } | null>(null);

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      setUserID(userEmitted.id);
    });
  });

  const receiveOrders = (data: object) => {
    const dataAsOrders = data as Orders;
    setOrders(dataAsOrders);
  };

  const getOrderStatusMenuItems = (orderStatus: string) => {
    const items: string[] =
      orderStatus.toLowerCase() == OrderStatus.PENDING
        ? [
            `Mark as ${capitalize(OrderStatus.FULLFILLED)}`,
            `Mark as ${capitalize(OrderStatus.VOIDED)}`,
          ]
        : [];
    return items;
  };

  const changeOrderStatus = async (
    orderID: number | string,
    status: string
  ) => {
    setLoadingOrders(true);
    const body = {
      status: status,
    };
    const response = await backendService.patch(`/orders/${orderID}`, body);
    const responseAsOrders = response as OrdersPatch;
    toast(responseAsOrders.message);
    setLoadingOrders(false);
    return responseAsOrders.success;
  };

  const onOrderMenuItemChange = (item: string, orderID: number | string) => {
    setOrderAndStatusSelected({
      orderID: orderID,
      status: item.split("Mark as ")[1].toLowerCase(),
    });
    setOrderStatusDialogIsOpen(true);
  };

  const onOrderStatusDialogClose = async (confirmed: boolean) => {
    if (confirmed && orderAndStatusSelected) {
      setOrderStatusDialogIsOpen(false);
      await changeOrderStatus(
        orderAndStatusSelected.orderID,
        orderAndStatusSelected.status
      );
      searchRef.current?.executeSearch();
    }
    setOrderStatusDialogIsOpen(false);
  };

  return (
    <>
      <div className="relative h-full">
        {userID && (
          <Search
            apiRoute={`/users/${userID}/orders`}
            searchBy="listingName"
            receiveResponse={receiveOrders}
            filterType={FilterComponentType.ORDERS}
            placeholderText="Search Orders"
            loadingResponse={(loading) => setLoadingOrders(loading)}
          />
        )}
        <div className="w-full px-[0.75rem] py-[2rem] max-h-[45rem] overflow-y-auto">
          {loadingOrders && <Spinner />}
          {!loadingOrders && orders && (
            <>
              {orders.data.results.map((order) => (
                <Order
                  order={order}
                  key={order.id}
                  menuItems={getOrderStatusMenuItems(order.status)}
                  onMenuItemClick={(item) =>
                    onOrderMenuItemChange(item, order.id)
                  }
                  className="mb-[1rem]"
                />
              ))}
              <KeysetPagination
                hasNextPage={orders.data.hasNextPage}
                hasPreviousPage={orders.data.hasPreviousPage}
                nextCursor={orders.data.nextCursor}
                previousCursor={orders.data.previousCursor}
              />
            </>
          )}
        </div>
      </div>
      {orderAndStatusSelected && (
        <Modal
          isOpen={orderStatusDialogIsOpen}
          onClose={() => setOrderStatusDialogIsOpen(false)}
        >
          <Dialog
            text={`Are you sure you\'d like to mark this order as ${orderAndStatusSelected?.status}`}
            header={"Change Order Status"}
            onClose={onOrderStatusDialogClose}
          />
        </Modal>
      )}
    </>
  );
}
