import { FormProvider, useForm } from "react-hook-form";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import backendService from "@/app/services/backend.service";
import ImageCarousel, { ImageReference } from "../ImageCarousel";
import { ListingData, SingleListing } from "@/app/models/Listings";
import { ChangeEvent, useState } from "react";
import { toastErrors } from "@/app/models/Generic";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface EditListingAttachmentProps {
  listingData: ListingData;
  onClose: () => void;
}

export default function EditListingAttachmentModal({
  listingData,
  onClose,
}: EditListingAttachmentProps) {
  const [imageDisplaying, setImageDisplaying] = useState<ImageReference>();
  const [loading, setLoading] = useState(false);

  const editListingFormSchema = z.object({
    attachment: z.instanceof(File),
  });
  const editListingForm = useForm<z.infer<typeof editListingFormSchema>>({
    resolver: zodResolver(editListingFormSchema),
  });

  const onListingSubmit = (values: z.infer<typeof editListingFormSchema>) => {
    setLoading(true);
    const body = {
      files: [values.attachment],
    };
    backendService
      .patch(`/listings/${listingData.id}`, body)
      .then((response) => {
        setLoading(false);
        const responseAsListing = response as SingleListing;
        if (!responseAsListing.success) {
          toastErrors(response);
          return;
        }
        toast(responseAsListing.message);
        onClose();
      });
  };

  const onAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files && event.target?.files.length > 0) {
      setImageDisplaying({
        url: URL.createObjectURL(event.target.files[0]),
        alt: event.target?.value,
        id: 1,
      });
    }
  };

  return (
    <div className="min-w-[25rem]">
      <ModalHeader
        title={`Edit ${listingData.name} Attachment(s)`}
        onClose={onClose}
      />
      <ModalBody>
        <>
          <FormProvider {...editListingForm}>
            <form onSubmit={editListingForm.handleSubmit(onListingSubmit)}>
              <FormField
                control={editListingForm.control}
                name="attachment"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        onChange={(event) => {
                          onChange(value);
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
              {imageDisplaying && <ImageCarousel images={[imageDisplaying]} />}
              <div className="flex w-max ml-auto mt-[1.5rem]">
                <button onClick={onClose} className="button !bg-[#BBBBBB]">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button ml-[1rem] h-[3rem] w-[5rem]"
                >
                  {loading ? <Spinner className="text-white" /> : "Save"}
                </button>
              </div>
            </form>
          </FormProvider>
        </>
      </ModalBody>
    </div>
  );
}
