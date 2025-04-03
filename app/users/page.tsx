"use client"

import { useCallback, useEffect, useState } from "react";
import { UserData, UserRole, Users } from "../models/User";
import Search from "../components/Search";
import User from "../components/User";
import { ConnectionData, Connections } from "../models/Connection";
import backendService from "../services/backend.service";
import { toast } from "sonner";

export default function UsersPage() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [connections, setConnections] = useState<string[] | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const response = await backendService.get("/users/@me");

            const userId = response.data?.id;
            setCurrentUserId(userId);
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchConnections = async () => {
            if (currentUserId) {
                setConnections(await getConnections());
            }
        }

        fetchConnections();
    }, [currentUserId]);

    const getConnections = async () => {
        let response = await backendService.get("/users/" + currentUserId + "/connections");

        console.log((response as Connections).data.results.map(connection => connection.followingId))
    
        return (response as Connections).data.results.map(connection => connection.followingId);
    }

    const onConnectButtonClicked = async (userId: string) => {
        backendService.post("/users/" + currentUserId + "/connections/" + userId, {}).then(response => {
            if(!response.success) {
                toast("Error occurred. Please try again", {
                    action: {
                        label: "Close",
                        onClick: () => {},
                    }
                });

                return;
            }

            let currentConnections = connections;
            currentConnections && setConnections([...currentConnections, userId]);
        })
    }
    
    const onConnectedButtonClicked = async (userId: string) => {
        backendService.delete("/users/" + currentUserId + "/connections/" + userId).then(response => {
            if(!response.success) {
                toast("Error occurred. Please try again", {
                    action: {
                        label: "Close",
                        onClick: () => {},
                    }
                });

                return;
            }

            let currentConnections = connections;
            currentConnections && setConnections([...currentConnections.slice(0, currentConnections.indexOf(userId)), 
                ...currentConnections.slice(currentConnections.indexOf(userId) + 1)]);
        })
    }

    function getListingsNum(userId: string) {
        return 0; //TODO
    }

    function getConnectionsNum(userId: string) {
        return 0; //TODO
    }
    
    const [users, setUsers] = useState<Users>({
        message: "Default",
        data: {
            count: 0,
            totalCount: 0,
            hasNext: false,
            nextToken: null,
            results: []
        }
    });

    const receiveUsers = useCallback((users: object) => {
        // received from Search component
        setUsers(users as Users);
    }, []);

    return <div>
        <Search 
            apiRoute={"/users"} 
            searchBy={"name"}
            receiveResponse={receiveUsers} 
            placeholderText="Search Users"
        />
        <div className="flex flex-wrap sm:mx-10 mt-8 gap-10 justify-center sm:justify-start">
            {users.data?.results.map(user => 
                (currentUserId != null && connections != null && user.id != currentUserId && user.type != UserRole.GUEST &&
                    <User
                        user={user}
                        listings={getListingsNum(user.id)}
                        connections={getConnectionsNum(user.id)}
                        onConnectButtonClicked={onConnectButtonClicked}
                        onConnectedButtonClicked={onConnectedButtonClicked}
                        connected={connections.includes(user.id)}
                        key={user.id}
                        className="mb-8"
                    />
                ))}
        </div>
    </div>
}