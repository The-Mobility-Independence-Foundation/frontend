"use client"

import { useRouter, useSearchParams } from "next/navigation";
import ProfileSidebar from "../components/ProfileSidebar";
import backendService from "../services/backend.service";
import { User, UserData } from "../models/User";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Account() {
  const [user, setUser] = useState<UserData>();
  const [self, setSelf] = useState(false);

  const router = useRouter();

  // TODO: API call for user
  const queryParams = useSearchParams();
  const userId = queryParams.get("user_id");
  useEffect(() => {
    backendService.get("/users/@me")
    .then(response => {
      const responseAsUser = response as User;
      if(!responseAsUser.success) {
        toast(responseAsUser.message);
        router.push("/landing");
        return;
      }
      setSelf(responseAsUser.data.id == userId);
      setUser(responseAsUser.data);
    });
  }, [userId])
  // TODO: API call for org

  return <div className="flex h-full">
    {user &&  
      <ProfileSidebar 
        user={user}
      />
    }
  </div>
}