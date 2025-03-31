import { OrganizationData } from "../models/Organization"
import { UserData } from "../models/User"

interface ProfileSidebarProps {
  user: UserData,
  // organization: OrganizationData
}

export default function ProfileSidebar({user}: ProfileSidebarProps) {
  // TODO: organization data
  
  return <div className="w-min bg-[#DDEDFF] drop-shadow-md p-[1rem]">
    <h2 className="text-nowrap">{user.firstName} {user.lastName}</h2>
    <p>@{user.displayName}</p>
    <p>{user.email}</p>
    <div className="bg-[#002856] text-white rounded-xl drop-shadow-md text-center my-1 py-1">ORGANIZATION</div>
    
    
    <div className="absolute bottom-5">
      <p className="font-medium">Last Activity:</p>
      <p className="text-xl">{new Date(user.lastActivity).toLocaleString()}</p>
    </div>
  </div>
}