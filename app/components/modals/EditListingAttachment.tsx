import { FormProvider, useForm } from "react-hook-form";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import backendService from "@/app/services/backend.service";
import ImageCarousel, { ImageReference } from "../ImageCarousel";
import { ListingData } from "@/app/models/Listings";
import { ChangeEvent, useState } from "react";

interface EditListingAttachmentProps {
  listingData: ListingData,
  onClose: () => void
}

export default function EditListingAttachmentModal({listingData, onClose}: EditListingAttachmentProps) {
  const [imageDisplaying, setImageDisplaying] = useState<ImageReference>();

  const editListingFormSchema = z.object({
    attachment: z.instanceof(File)
  });
  const editListingForm = useForm<z.infer<typeof editListingFormSchema>>({
    resolver: zodResolver(editListingFormSchema)
  });
  
  const onListingSubmit = (values: z.infer<typeof editListingFormSchema>) => {
    // TODO: Uncomment when backend is hooked up and figure out where to put attachment
    // const body = {
    //  "title": listingData.title,
    //  "description": "",
    //  "attributes": listingData.attributes,
    //  "quantity": listingData.quantity,
    //  "inventoryItemId": listingData.inventoryItem.id,
    //  "status": listingData.status
    // };
    // backendService.patch(`/listings/${listingData.id}`, body)
    //   .then(response => {
    //     // TODO: toastr with message
    //   }
    // );
    if(values) {
      onClose();
    }
  }

  const onAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target?.files && event.target?.files.length > 0) {
      setImageDisplaying({
        url: URL.createObjectURL(event.target.files[0]),
        alt: event.target?.value,
        id: 1
      });
    }
  }

  return (
    <div className="min-w-[25rem]">
      <ModalHeader title={`Edit ${listingData.title} Attachment`} onClose={onClose} />
      <ModalBody>
        <>
          <FormProvider {...editListingForm}>
            <form
              onSubmit={editListingForm.handleSubmit(onListingSubmit)}
            >
              <FormField
                control={editListingForm.control}
                name="attachment"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...fieldProps}
                        onChange={event => {
                          onChange(event.target.files && event.target.files[0]);
                          onAttachmentChange(event);
                        }}
                        type="file" 
                        accept=".png,.jpg,.jpeg"
                        className="mb-[1rem]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {imageDisplaying &&
                <ImageCarousel 
                  images={[imageDisplaying]}
                />
              }
              <div className="flex w-max ml-auto mt-[1.5rem]">
                <button onClick={onClose} className="button !bg-[#BBBBBB]">Cancel</button>
                <button type="submit" className="button ml-[1rem]">
                  Save
                </button>
              </div>
            </form>
          </FormProvider>
        </>
      </ModalBody>
    </div>
  );
}