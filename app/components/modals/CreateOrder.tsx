import { ListingData } from "@/app/models/Listings";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";
import ImageCarousel, { ImageReference } from "../ImageCarousel";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import backendService from "@/app/services/backend.service";
import { OrdersPost } from "@/app/models/Order";
import { toastErrors } from "@/app/models/Generic";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface CreateOrderProps {
  listing: ListingData;
  userID: number | string;
  listingImages?: ImageReference[];
  onClose: (submitted: boolean) => void;
}

export default function CreateOrder({
  listing,
  userID,
  listingImages,
  onClose,
}: CreateOrderProps) {
  const [loading, setLoading] = useState(false);

  const part = listing.part;

  const orderFormSchema = z.object({
    quantity: z.coerce
      .number()
      .min(1, "Must list at least one item.")
      .max(listing.quantity, `Cannot order more than what is available`),
  });

  const orderForm = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const onOrderSubmit = (values: z.infer<typeof orderFormSchema>) => {
    setLoading(true);
    const body = {
      addressLine1: listing.address.addressLine1,
      addressLine2: listing.address.addressLine2,
      city: listing.address.city,
      state: listing.address.state,
      zipCode: listing.address.zipCode,
      listingId: listing.id,
      recipientId: userID,
      quantity: values.quantity,
    };
    backendService.post(`/orders`, body).then((response) => {
      setLoading(false);
      const responseAsOrders = response as OrdersPost;
      if (!responseAsOrders.success) {
        toastErrors(response);
        return;
      }
      toast(responseAsOrders.message);
      onClose(true);
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          event.preventDefault();
          if (orderForm.formState.isValid) {
            orderForm.handleSubmit(onOrderSubmit)();
          }
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  });

  return (
    <>
      <ModalHeader
        title={`Create an Order For ${part.name}`}
        onClose={() => onClose(false)}
      />
      <ModalBody>
        <>
          <div className="flex">
            <div>
              <h4>{part.name}</h4>
              <h5>{part.description}</h5>
              <p className="mt-[revert]">#{part.partNumber}</p>
            </div>
            <ul className="ml-[3rem] max-h-[10rem] overflow-y-auto">
              {Object.keys(listing.attributes).map((key) => (
                <li
                  className="mb-[0.25rem]"
                  key={`${key}: ${listing.attributes[key]}`}
                >
                  - {key}: {listing.attributes[key]}
                </li>
              ))}
            </ul>
            <div className="flex flex-col ml-[2.5rem] text-right">
              <h5>{listing.organization.name}</h5>
              <div>
                <p>{listing.organization.phoneNumber}</p>
              </div>
            </div>
          </div>
          {listingImages && (
            <ImageCarousel
              images={listingImages}
              className="mx-auto my-[1rem]"
            />
          )}
          <span className="flex items-center">
            <p>Quantity Available: </p>
            <h5 className="ml-[0.5rem]">{listing.quantity}</h5>
          </span>
          <FormProvider {...orderForm}>
            <form onSubmit={orderForm.handleSubmit(onOrderSubmit)}>
              <FormField
                control={orderForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#2D3748]">
                      Enter the quantity you&apos;d like to order:
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white rounded-sm w-[50%]"
                        type="number"
                        min="1"
                        max={listing.quantity}
                        required={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-max ml-auto mt-[1.5rem]">
                <button
                  onClick={() => onClose(false)}
                  className="button !bg-[#BBBBBB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button ml-[1rem] h-[3rem] w-[8rem]"
                >
                  {loading ? (
                    <Spinner className="text-white" />
                  ) : (
                    "Create Order"
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </>
      </ModalBody>
    </>
  );
}
