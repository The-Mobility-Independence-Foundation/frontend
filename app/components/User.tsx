import { Button } from "@/components/ui/button";
import { UserData } from "../models/User";
import { StarFilledIcon } from "@radix-ui/react-icons"
import backendService from "../services/backend.service";

export interface UserProps {
    user: UserData;
    onConnectButtonClicked: (userId: string) => void;
    onConnectedButtonClicked: (user: UserData) => void;
    connected: boolean;
    className?: string;
}

export default function User({user, onConnectButtonClicked, onConnectedButtonClicked, connected, className}: UserProps) {
    return <div className={"bg-[#DDEDFF] px-5 py-3 rounded-md drop-shadow-md w-[350px] " + className}>
        <h5 className="text-center"><a href={"/profile/listings?u_id=" + user.id}>{user.displayName}</a></h5>

        <div className="flex">
            <p className="font-medium">{"@" + user.username}</p>
            
            <div className="flex ml-auto">
                <StarFilledIcon className="mt-[6px]"></StarFilledIcon>
                <p className="text-[#2D3748] text-xl">{user.rating}</p><p className="text-[#2D3748] mt-1">/5.0</p>
            </div>
        </div>

        <div className="bg-[#002856] text-white rounded-lg drop-shadow-md text-center mb-1">{user.organization.name}</div>

        <div className="flex mb-5">
            <div>
                <p>{user.listingsNum + " listings"}</p>
                <p>{user.connectionsNum + " connections"}</p>
            </div>

            <div className="ml-auto">
                <p>Last Active:</p>
                <p>{user.lastActive}</p>
            </div>
        </div>

        <div className="flex justify-center">
            {!connected && <Button className="button" onClick={() => onConnectButtonClicked(user.id)}>+ Connect</Button>}
            {connected && <Button className="bg-[#009D4F]" onClick={() => onConnectButtonClicked(user.id)}>Connected</Button>}
        </div>
    </div>
}