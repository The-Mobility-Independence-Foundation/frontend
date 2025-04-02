"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { UserData } from "../models/User";
import { useEffect, useState } from "react";
import { userEmitter } from "../layout";

export default function AccountSettings() {
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    userEmitter.once("user", (userEmitted: UserData) => {
      setUser(userEmitted);
    })
  })

  const personalInformationSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    displayName: z.string(),
    active: z.boolean(),
  });

  const personalInformationForm = useForm<z.infer<typeof personalInformationSchema>>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      active: user && !user.inactive
    }
  })

  return <div className="p-[1rem]">
    <div className="flex flex-wrap justify-between pt-[2rem]">
      <div className="rounded bg-[#002856] p-[1rem] drop-shadow-lg mx-[0.5rem] mb-[1rem]">
        <h4>Change Personal Information</h4>

      </div>
    </div>
  </div>
}