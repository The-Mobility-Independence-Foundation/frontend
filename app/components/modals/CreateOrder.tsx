import { ListingData } from "@/app/models/Listings"
import ModalHeader from "./ModalHeader"
import ModalBody from "./ModalBody";
import ImageCarousel, { ImageReference } from "../ImageCarousel";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import backendService from "@/app/services/backend.service";

interface CreateOrderProps {
  listing: ListingData
  listingImages: ImageReference[]
  onClose: () => void
}

export default function CreateOrder({listing, listingImages, onClose}: CreateOrderProps) {
  const inventoryItem = listing.inventoryItem;
  const part = inventoryItem.part;

  // TODO: hitting "enter" submits form

  const orderFormSchema = z.object({
    quantity: z.coerce
      .number()
      .min(1, "Must list at least one item.")
      .max(inventoryItem.publicCount, `Listing quantity cannot exceed availability (${listing.quantity})`)
  })

  const orderForm = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema)
  });

  const onOrderSubmit = (values: z.infer<typeof orderFormSchema>) => {
    // TODO: API call for submitting order -> Change once it's been created
    const body = {
      listingId: listing.id,
      quantity: values.quantity
    }
    backendService.post(`/order`, body)
      .then(response => {
        // TODO: toastr with message
      }
    );
  }

  return (
    <div>
      <ModalHeader
        title={`Create an Order For ${part.name}`}
        onClose={onClose}
      />
      <ModalBody>
        <>
          <div className="flex">
            <div>
              <h4>{part.name}</h4>
              <h5>{part.partNumber}</h5>
              <p className="mt-[revert]">{part.model}</p>
              <p>{part.partType}</p>
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
              <h5>{inventoryItem.inventory.organization.name}</h5>
              <div>
                <p>{inventoryItem.inventory.organization.email}</p>
                <p>{inventoryItem.inventory.organization.phoneNumber}</p>
              </div>
            </div>
          </div>
          <ImageCarousel images={listingImages} className="mx-auto my-[1rem]" />
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
                      Enter the quantity you'd like to order:
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white rounded-sm w-[50%]"
                        type="number"
                        min="1"
                        max={listing.quantity}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-max ml-auto mt-[1.5rem]">
                <button onClick={onClose} className="button !bg-[#BBBBBB]">Cancel</button>
                <button type="submit" className="button ml-[1rem]">
                  Create Order
                </button>
              </div>
            </form>
          </FormProvider>
        </>
      </ModalBody>
    </div>
  );
}
