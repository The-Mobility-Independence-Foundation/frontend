import { FormProvider, useForm } from "react-hook-form";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import backendService from "@/app/services/backend.service";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toastErrors } from "@/app/models/Generic";

interface CreateConnectionModalProps {
  currentUserId: string;
  onClose: (submit: boolean) => void;
}

export default function CreateConnectionModal({currentUserId, onClose}: CreateConnectionModalProps) {
  const [loadingCreate, setLoadingCreate] = useState(false);

  const createConnectionFormSchema = z.object({
    displayName: z
      .string()
      .min(1, "Display Name is required")
  });
  const createConnectionForm = useForm<z.infer<typeof createConnectionFormSchema>>({
    resolver: zodResolver(createConnectionFormSchema)
  })
  
  const onSubmit = (values: z.infer<typeof createConnectionFormSchema>) => {
    backendService.get("/users?username=" + values.displayName).then(response => {
        const userId = response.data.results[0].id;

        setLoadingCreate(true);

        backendService.post(`/users/${currentUserId}/connections/${userId}`, {}).then(response => {
            console.log(response)
            if(!response.success) {
                toastErrors(response);
    
                setLoadingCreate(false);
                return;
            }

            onClose(true);
        })
    })
  }

  return (
    <div className="min-w-[25rem]">
      <ModalHeader title={`Create Connection`} onClose={() => onClose(false)} />
      <ModalBody>
          <FormProvider {...createConnectionForm}>
            <form
              onSubmit={createConnectionForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={createConnectionForm.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                    <div className="flex">
                      <p className="mt-1">@</p>
                      <Input
                        {...field}
                        type="string"
                        required={true}
                        placeholder="username"
                        className="mb-[0.75rem] ml-2"
                      />
                    </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex w-max ml-auto mt-[1.5rem]">
                <button 
                  onClick={() => onClose(false)} 
                  className="button !bg-[#BBBBBB]"
                >Cancel</button>
                <button 
                  type="submit" 
                  className="button ml-[1rem] h-[3rem] w-[5rem]"
                >
                    {loadingCreate ? <Spinner className="text-white" /> : "Submit"}
                </button>
              </div>
            </form>
          </FormProvider>
      </ModalBody>
    </div>
  );
}