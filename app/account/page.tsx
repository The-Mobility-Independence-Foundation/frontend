"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { User, UserData } from "../models/User";
import { useEffect, useState } from "react";
import { userEmitterBus } from "@/lib/userEmitterBus";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import backendService from "../services/backend.service";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Modal from "../components/modals/Modal";
import Dialog from "../components/modals/Dialog";

export default function AccountSettings() {
  const [user, setUser] = useState<UserData>();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      setUser(userEmitted);
    });
  });

  const personalInformationSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    displayName: z.string().optional(),
  });

  const personalInformationForm = useForm<
    z.infer<typeof personalInformationSchema>
  >({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      displayName: "",
    },
  });

  const onFormSubmit = (values: z.infer<typeof personalInformationSchema>) => {
    if (user) {
      let fields: object = {};
      if (values.firstName) {
        fields = { ...fields, firstName: values.firstName };
      }
      if (values.lastName) {
        fields = { ...fields, lastName: values.lastName };
      }
      if (values.displayName) {
        fields = { ...fields, displayName: values.displayName };
      }
      setLoadingSubmit(true);
      backendService.patch(`/users/${user?.id}`, fields).then((response) => {
        const responseAsUser = response as User;
        console.log(responseAsUser);
        if (!responseAsUser.success) {
          toast(responseAsUser.message);
          setLoadingSubmit(false);
          return;
        }
        userEmitterBus.emit("user", responseAsUser.data);
        setLoadingSubmit(false);
      });
    }
  };

  const logOut = (confirm: boolean) => {
    setLogoutModalIsOpen(false);
    if (confirm) {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  return (
    <>
      {user && (
        <>
          <div className="relative p-[1rem] !text-white h-full">
            <div className="flex flex-wrap justify-between pt-[2rem]">
              <div className="w-full rounded bg-[#002856] p-[1rem] drop-shadow-lg mx-[0.5rem] mb-[1rem]">
                <h4 className="text-white">Change Personal Information</h4>
                <FormProvider {...personalInformationForm}>
                  <form
                    className="flex flex-col"
                    onSubmit={personalInformationForm.handleSubmit(
                      onFormSubmit
                    )}
                  >
                    <div className="flex justify-between mb-[1rem]">
                      <FormField
                        control={personalInformationForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="w-[48%]">
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={user.firstName}
                                className="bg-white text-black"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInformationForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="w-[48%]">
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={user.lastName}
                                className="bg-white text-black"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={personalInformationForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem className="w-full mb-[1rem]">
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={user.displayName}
                              className="bg-white text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <button className="button ml-auto" type="submit">
                      {loadingSubmit ? (
                        <Spinner className="text-white" />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </form>
                </FormProvider>
              </div>
            </div>
            <p 
            onClick={() => setLogoutModalIsOpen(true)}
            className="underline absolute bottom-2 right-5 !text-black cursor-pointer w-min text-nowrap">
              Log Out
            </p>
          </div>
          <Modal
            isOpen={logoutModalIsOpen}
            onClose={() => setLogoutModalIsOpen(false)}
          >
            <Dialog
              text={"Are you sure you'd like to log out?"}
              onClose={logOut}
              header={"Log Out"}
            />
          </Modal>
        </>
      )}
    </>
  );
}
