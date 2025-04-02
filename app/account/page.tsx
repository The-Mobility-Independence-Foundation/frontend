"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod"
import { UserData } from "../models/User";
import { useEffect, useState } from "react";
import { userEmitter } from "../layout";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function AccountSettings() {
  const [user, setUser] = useState<UserData>();
  const [personalInformationFields, setPersonalInformationFields] = useState<any>();

  useEffect(() => {
    userEmitter.on("user", (userEmitted: UserData) => {
      setUser(userEmitted);
    })
  })

  const personalInformationSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    displayName: z.string().optional(),
    active: z.boolean(),
  });

  const personalInformationForm = useForm<z.infer<typeof personalInformationSchema>>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      displayName: "",
      active: false
    }
  })

  useEffect(() => {
    if(user) {
      personalInformationForm.setValue("active", !user.inactive);
    }
  }, [user]);

  const onFormSubmit = (values: z.infer<typeof personalInformationSchema>) => {
    let fields = {inactive: !values.active};
    if(values.firstName) {
      Object.assign({}, fields, {firstName: values.firstName});
    }
    if(values.lastName) {
      Object.assign({}, fields, {lastName: values.lastName});
    }
    if(values.displayName) {
      Object.assign({}, fields, {displayName: values.displayName});
    }
    setPersonalInformationFields(fields);
  }

  return <>{user && <div className="p-[1rem] !text-white">
    <div className="flex flex-wrap justify-between pt-[2rem]">
      <div className="w-full rounded bg-[#002856] p-[1rem] drop-shadow-lg mx-[0.5rem] mb-[1rem]">
        <h4 className="text-white">Change Personal Information</h4>
        <FormProvider {...personalInformationForm}>
          <form 
            className="flex flex-col"
            onSubmit={personalInformationForm.handleSubmit(onFormSubmit)}
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
            <FormField
              control={personalInformationForm.control}
              name="active"
              render={({ field }) => (
                <FormItem className="mb-[1rem]">
                <FormControl>
                  <div className="flex items-center">
                      <Checkbox
                        className="bg-white data-[state=checked]:bg-blue-500 w-[20px] h-[20px] mr-[0.4rem]"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                      <FormLabel>Active</FormLabel>
                  </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <button className="button ml-auto" type="submit">Submit</button>
          </form>
        </FormProvider>
      </div>
    </div>
  </div>}</>
}