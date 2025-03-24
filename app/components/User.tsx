import { Button } from "@/components/ui/button";
import { UserData } from "../models/User";
import { StarFilledIcon } from "@radix-ui/react-icons"

export interface UserProps {
    user: UserData;
    className?: string;
}

export default function User({user, className}: UserProps) {
    return <div className={"bg-[#DDEDFF] px-5 py-3 rounded-md drop-shadow-md w-[350px] " + className}>
        <h5 className="text-center">{user.displayName}</h5>

        <div className="flex">
            <p>{"@" + user.username}</p>
            
            <div className="flex ml-auto">
                <StarFilledIcon className="mt-1"></StarFilledIcon>
                <p>{user.rating + "/5.0"}</p>
            </div>
        </div>

        <div>{user.organization.name}</div>

        <div className="flex">
            <div>
                <p>{user.listingsNum + " listings"}</p>
                <p>{user.connectionsNum + " connections"}</p>
            </div>

            <div className="ml-auto">
                <p>Last Active:</p>
                <p>{user.lastActive}</p>
            </div>
        </div>

        <Button>+ Connect</Button>
    </div>
}