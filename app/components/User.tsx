import { Button } from "@/components/ui/button";
import { UserData } from "../models/User";
import { StarFilledIcon } from "@radix-ui/react-icons"

export interface UserProps {
    user: UserData;
    listings: number;
    connections?: number;
    onConnectButtonClicked?: (userId: string) => void;
    onConnectedButtonClicked?: (userId: string) => void;
    connected?: boolean;
    connectionsPage?: boolean;
    className?: string;
}

export default function User({user, listings, connections, onConnectButtonClicked, onConnectedButtonClicked, connected, connectionsPage, className}: UserProps) {
    return <div className={"bg-[#DDEDFF] px-5 py-3 rounded-md drop-shadow-md w-[350px] " + className}>
        <h5 className="text-center"><a href={"/profile/listings?u_id=" + user.id}>{user.firstName + " " + user.lastName}</a></h5>

        <div className="flex">
            <p className="font-medium">{"@" + user.displayName}</p>
            
            {/* Not in current scope, feel free to uncomment if you're a future team finishing this site */}
            {/* <div className="flex ml-auto">
                <StarFilledIcon className="mt-[6px]"></StarFilledIcon>
                <p className="text-[#2D3748] text-xl">{user.rating}</p><p className="text-[#2D3748] mt-1">/5.0</p>
            </div> */}
        </div>

        {user.organization && <div className="bg-[#002856] text-white rounded-lg drop-shadow-md text-center mb-1">{user.organization.name}</div>}

        {!connectionsPage && <div className="flex mb-5">
            <div>
                <p>{listings + " listings"}</p>
                <p>{connections + " connections"}</p>
            </div>

            <div className="ml-auto">
                <p>Last Active:</p>
                <p>{new Date(user.lastActivity).toLocaleDateString()}</p>
            </div>
        </div>}

        {connectionsPage && <p className="text-center">{listings + " listings"}</p>}

        {!connectionsPage && onConnectButtonClicked && onConnectedButtonClicked && <div className="flex justify-center">
            {!connected && <Button className="button" onClick={() => onConnectButtonClicked(user.id)}>+ Connect</Button>}
            {connected && <Button className="bg-[#009D4F]" onClick={() => onConnectedButtonClicked(user.id)}>Connected</Button>}
        </div>}
    </div>
}