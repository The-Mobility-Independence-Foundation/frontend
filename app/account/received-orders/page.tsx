"use client";

// import KeysetPagination from "@/app/components/KeysetPagination";
import Dialog from "@/app/components/modals/Dialog";
import Modal from "@/app/components/modals/Modal";
import Order from "@/app/components/Order";
import Search from "@/app/components/Search";
import { userEmitterBus } from "@/app/layout";
import { toastErrors } from "@/app/models/Generic";
import { OrderData, Orderpool, OrdersPatch } from "@/app/models/Order";
import { UserData } from "@/app/models/User";
import backendService from "@/app/services/backend.service";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// MENU OPTIONS
const HANDLE_ORDER = "Handle Order";

export default function AccountReceivedOrders() {
  const [orders, setOrders] = useState<Orderpool>();
  const [orgID, setOrgID] = useState("");
  const [userID, setUserID] = useState("");
  const [handleOrderDialogIsOpen, setHandleOrderDialogIsOpen] = useState(false);
  const [orderHandling, setOrderHandling] = useState<number>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchRef = useRef<{
    executeSearch: () => void;
    clearSearch: () => void;
  } | null>(null);

  const receiveOrders = () => {
    setLoading(true);
    backendService.get(`/organizations/${orgID}/orderpool`).then((response) => {
      setLoading(false);
      const responseAsOrderpool = response as Orderpool;
      if(!responseAsOrderpool.success) {
        toastErrors(response);
        return;
      }
      setOrders(responseAsOrderpool);
    })
  };

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      setUserID(userEmitted.id);
      if (userEmitted.organization) {
        setOrgID(userEmitted.organization.id);
      } else {
        router.push("/listings"); // route somewhere else?
      }
    });
  });

  useEffect(() => {
    if(orgID) {
      receiveOrders();
    }
  }, [orgID])

  const handleOrder = async (orderID: number | string) => {
    setLoading(true);
    const body = {
      providerId: userID,
    };
    const response = await backendService.patch(`/orders/${orderID}`, body);
    const responseAsOrders = response as OrdersPatch;
    toast(responseAsOrders.message);
    setLoading(false);
    return responseAsOrders.success;
  };

  const onMenuItemClick = (item: string, order: OrderData) => {
    switch (item) {
      case HANDLE_ORDER:
        setOrderHandling(order.id);
        setHandleOrderDialogIsOpen(true);
        break;
    }
  };

  const onHandleOrderDialogClose = async (confirm: boolean) => {
    if (confirm && orderHandling) {
      setHandleOrderDialogIsOpen(false);
      await handleOrder(orderHandling);
      searchRef.current?.executeSearch();
    }
    setHandleOrderDialogIsOpen(false);
  };

  return (
    <>
      <div className="relative h-full">
        {/* {orgID && (
          <Search
            apiRoute={`/organizations/${orgID}/orderpool`}
            searchBy=""
            receiveResponse={receiveOrders}
            placeholderText="Search Orders"
            loadingResponse={(loading) => setLoading(loading)}
          /> 
        )} */}
        <div className="mt-[2rem] w-full px-[0.75rem] py-[2rem] max-h-[45rem] overflow-y-auto">
          {loading && <Spinner />}
          {!loading && orders && (
            <>
              {orders.data.map((order) => (
                <Order
                  order={order}
                  key={order.id}
                  menuItems={[HANDLE_ORDER]}
                  onMenuItemClick={(item) => onMenuItemClick(item, order)}
                  className="mb-[1rem]"
                  onStatusClick={() => {
                    setOrderHandling(order.id);
                    setHandleOrderDialogIsOpen(true);
                  }}
                  statusOverride="Handle"
                  userID={userID}
                />
              ))}
              {/* As of now, /orderpool doesn't have pagination. Once it does implement this */}
              {/* <KeysetPagination
                hasNextPage={orders.data.hasNextPage}
                hasPreviousPage={orders.data.hasPreviousPage}
                nextCursor={orders.data.nextCursor}
                previousCursor={orders.data.previousCursor}
              /> */}
            </>
          )}
          {orders?.data.length == 0 && !loading && 
            <h4 className="text-gray-400">No received orders</h4>
          }
        </div>
      </div>
      <Modal
        isOpen={handleOrderDialogIsOpen}
        onClose={() => setHandleOrderDialogIsOpen(false)}
      >
        <Dialog
          text={
            'Are you sure you\'d like to handle this order? It will appear under the "My Orders" tab on your profile.'
          }
          header={"Handle Order"}
          onClose={onHandleOrderDialogClose}
        />
      </Modal>
    </>
  );
}
