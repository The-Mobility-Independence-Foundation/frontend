import { FormProvider, useForm } from "react-hook-form";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface InviteUserModalProps {
  onClose: (submit: boolean) => void;
}

export default function InviteUserModal({onClose}: InviteUserModalProps) {
  const [loadingInvite, setLoadingInvite] = useState(false);

  const inviteFormSchema = z.object({
    displayName: z
      .string()
      .min(1, "Display Name is required")
  });
  const inviteForm = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema)
  })
  
  const onSubmit = (values: z.infer<typeof inviteFormSchema>) => {
    setLoadingInvite(true);
    console.log(values);
    //TODO endpoint
    setLoadingInvite(false);
  }

  return (
    <div className="min-w-[25rem]">
      <ModalHeader title={`Send Invite`} onClose={() => onClose(false)} />
      <ModalBody>
          <FormProvider {...inviteForm}>
            <form
              onSubmit={inviteForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={inviteForm.control}
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
                    {loadingInvite ? <Spinner className="text-white" /> : "Submit"}
                </button>
              </div>
            </form>
          </FormProvider>
      </ModalBody>
    </div>
  );
}